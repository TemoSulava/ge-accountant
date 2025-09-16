import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InvoiceStatus, Prisma, TaxStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { RequestUser } from "../../common/types/request-user";
import { ClosePeriodDto, PayTaxPeriodDto } from "./dto/tax.dto";

@Injectable()
export class TaxService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: RequestUser, entityId: string) {
    await this.ensureEntityOwnership(user.id, entityId);
    return this.prisma.taxPeriod.findMany({
      where: { entityId },
      orderBy: { periodStart: "desc" }
    });
  }

  async closePeriod(user: RequestUser, entityId: string, dto: ClosePeriodDto) {
    const entity = await this.ensureEntityOwnership(user.id, entityId);
    const { periodStart, periodEnd } = this.resolvePeriod(dto);

    const existing = await this.prisma.taxPeriod.findFirst({
      where: { entityId, periodStart, periodEnd }
    });
    if (existing) {
      throw new BadRequestException("TAX_PERIOD_ALREADY_EXISTS");
    }

    const invoices = await this.prisma.invoice.findMany({
      where: {
        entityId,
        status: { in: [InvoiceStatus.ISSUED, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.PAID] },
        issueDate: {
          gte: periodStart,
          lt: periodEnd
        }
      },
      select: { total: true }
    });

    const turnover = invoices.reduce((sum, invoice) => sum + Number(invoice.total), 0);
    const turnoverDecimal = new Prisma.Decimal(turnover.toFixed(2));

    const taxRateDecimal = this.resolveTaxRate(entity.taxStatus);
    const taxDueDecimal = turnoverDecimal.mul(taxRateDecimal).div(100);

    const created = await this.prisma.taxPeriod.create({
      data: {
        entityId,
        periodStart,
        periodEnd,
        turnover: turnoverDecimal,
        taxRate: taxRateDecimal,
        taxDue: taxDueDecimal
      }
    });

    await this.createReminder(entityId, periodEnd);

    return created;
  }

  async markPaid(user: RequestUser, taxPeriodId: string, dto: PayTaxPeriodDto) {
    const taxPeriod = await this.prisma.taxPeriod.findFirst({
      where: { id: taxPeriodId, entity: { userId: user.id } }
    });
    if (!taxPeriod) {
      throw new NotFoundException("TAX_PERIOD_NOT_FOUND");
    }

    const paidAt = dto.paidAt ? new Date(dto.paidAt) : new Date();

    return this.prisma.taxPeriod.update({
      where: { id: taxPeriodId },
      data: { paid: true, paidAt }
    });
  }

  async exportRs(user: RequestUser, entityId: string, period: string) {
    await this.ensureEntityOwnership(user.id, entityId);
    const [year, month] = period.split("-").map((part) => Number(part));
    if (!year || !month) {
      throw new BadRequestException("INVALID_PERIOD");
    }

    const periodStart = new Date(Date.UTC(year, month - 1, 1));
    const periodEnd = new Date(Date.UTC(year, month, 1));

    const taxPeriod = await this.prisma.taxPeriod.findFirst({
      where: { entityId, periodStart, periodEnd }
    });

    if (!taxPeriod) {
      throw new NotFoundException("TAX_PERIOD_NOT_FOUND");
    }

    const entity = await this.prisma.entity.findUnique({ where: { id: entityId } });
    if (!entity) {
      throw new NotFoundException("ENTITY_NOT_FOUND");
    }

    const csv = [
      "Period,EntityName,TaxId,TurnoverGEL,TaxRatePct,TaxDueGEL",
      [
        `${year}-${String(month).padStart(2, "0")}`,
        entity.displayName,
        entity.taxId ?? "",
        Number(taxPeriod.turnover).toFixed(2),
        Number(taxPeriod.taxRate).toString(),
        Number(taxPeriod.taxDue).toFixed(2)
      ].join(",")
    ].join("\n");

    return { csv };
  }

  private resolvePeriod(dto: ClosePeriodDto) {
    const start = dto.periodStart ? new Date(dto.periodStart) : this.startOfCurrentMonth();
    if (Number.isNaN(start.getTime())) {
      throw new BadRequestException("INVALID_PERIOD_START");
    }
    const end = dto.periodEnd ? new Date(dto.periodEnd) : this.startOfNextMonth(start);
    if (Number.isNaN(end.getTime()) || end <= start) {
      throw new BadRequestException("INVALID_PERIOD_END");
    }

    return {
      periodStart: start,
      periodEnd: end
    };
  }

  private startOfCurrentMonth() {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  }

  private startOfNextMonth(date: Date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
  }

  private resolveTaxRate(taxStatus: TaxStatus) {
    if (taxStatus === TaxStatus.SMALL_BUSINESS) {
      return new Prisma.Decimal(1);
    }
    return new Prisma.Decimal(20);
  }

  private async createReminder(entityId: string, periodEnd: Date) {
    const dueDate = this.rsDueDate(periodEnd);
    await this.prisma.reminder.create({
      data: {
        entityId,
        type: "RS_DECLARATION",
        dueDate,
        channel: "email",
        payload: { note: "RS.ge declaration reminder" }
      }
    });
  }

  private rsDueDate(periodEnd: Date) {
    const due = new Date(Date.UTC(periodEnd.getUTCFullYear(), periodEnd.getUTCMonth(), 15, 5));
    return due;
  }

  private async ensureEntityOwnership(userId: string, entityId: string) {
    const entity = await this.prisma.entity.findFirst({ where: { id: entityId, userId } });
    if (!entity) {
      throw new NotFoundException("ENTITY_NOT_FOUND");
    }
    return entity;
  }
}

