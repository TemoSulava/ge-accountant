import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InvoiceStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { RequestUser } from "../../common/types/request-user";
import { AuditService } from "../audit/audit.service";
import { CreateInvoiceDto, CreatePaymentDto, UpdateInvoiceStatusDto } from "./dto/invoice.dto";

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async list(user: RequestUser, entityId: string) {
    await this.ensureEntityOwnership(user.id, entityId);
    return this.prisma.invoice.findMany({
      where: { entityId },
      include: { items: true, payments: true },
      orderBy: { issueDate: "desc" }
    });
  }

  async getById(user: RequestUser, invoiceId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, entity: { userId: user.id } },
      include: { items: true, payments: true }
    });
    if (!invoice) {
      throw new NotFoundException("INVOICE_NOT_FOUND");
    }
    return invoice;
  }

  async create(user: RequestUser, entityId: string, dto: CreateInvoiceDto) {
    await this.ensureEntityOwnership(user.id, entityId);

    const { subtotal, tax, total, itemsData } = this.computeTotals(dto);
    const number = await this.generateInvoiceNumber(entityId, dto.issueDate);

    const invoice = await this.prisma.invoice.create({
      data: {
        entityId,
        number,
        clientName: dto.clientName,
        clientEmail: dto.clientEmail,
        clientAddress: dto.clientAddress,
        issueDate: new Date(dto.issueDate),
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        currency: dto.currency ?? "GEL",
        notes: dto.notes,
        status: InvoiceStatus.ISSUED,
        subtotal,
        tax,
        total,
        items: {
          createMany: { data: itemsData }
        }
      },
      include: { items: true, payments: true }
    });

    await this.audit.log(user.id, entityId, "invoice:create", {
      invoiceId: invoice.id,
      number: invoice.number,
      total: Number(invoice.total)
    });

    return invoice;
  }

  async updateStatus(user: RequestUser, invoiceId: string, dto: UpdateInvoiceStatusDto) {
    await this.ensureInvoiceOwnership(user.id, invoiceId);

    const invoice = await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: dto.status },
      include: { items: true, payments: true }
    });

    await this.audit.log(user.id, invoice.entityId, "invoice:updateStatus", {
      invoiceId,
      status: dto.status
    });

    return invoice;
  }

  async addPayment(user: RequestUser, invoiceId: string, dto: CreatePaymentDto) {
    const invoice = await this.ensureInvoiceOwnership(user.id, invoiceId);

    const payment = await this.prisma.payment.create({
      data: {
        invoiceId,
        amount: new Prisma.Decimal(dto.amount.toFixed(2)),
        date: new Date(dto.date),
        method: dto.method,
        reference: dto.reference
      }
    });

    const payments = await this.prisma.payment.findMany({
      where: { invoiceId },
      select: { amount: true }
    });

    const paidTotal = payments.reduce((sum, item) => sum + Number(item.amount), 0);
    const invoiceTotal = Number(invoice.total);

    let status = invoice.status;
    if (paidTotal >= invoiceTotal) {
      status = InvoiceStatus.PAID;
    } else if (paidTotal > 0) {
      status = InvoiceStatus.PARTIALLY_PAID;
    }

    const updatedInvoice = await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status },
      include: { items: true, payments: true }
    });

    await this.audit.log(user.id, invoice.entityId, "invoice:addPayment", {
      invoiceId,
      paymentId: payment.id,
      amount: dto.amount,
      status
    });

    return { payment, invoice: updatedInvoice };
  }

  private computeTotals(dto: CreateInvoiceDto) {
    const itemsData = dto.items.map((item) => {
      const quantity = new Prisma.Decimal(item.quantity.toFixed(2));
      const unitPrice = new Prisma.Decimal(item.unitPrice.toFixed(2));
      const total = quantity.mul(unitPrice);
      return {
        description: item.description,
        quantity,
        unitPrice,
        total
      };
    });

    const subtotalValue = itemsData.reduce((sum, item) => sum + Number(item.total), 0);
    const subtotal = new Prisma.Decimal(subtotalValue.toFixed(2));
    const tax = new Prisma.Decimal(0);
    const total = subtotal.add(tax);

    return { subtotal, tax, total, itemsData };
  }

  private async generateInvoiceNumber(entityId: string, issueDate: string) {
    const date = new Date(issueDate);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException("INVALID_ISSUE_DATE");
    }
    const year = date.getUTCFullYear();
    const count = await this.prisma.invoice.count({
      where: {
        entityId,
        issueDate: {
          gte: new Date(Date.UTC(year, 0, 1)),
          lt: new Date(Date.UTC(year + 1, 0, 1))
        }
      }
    });
    const next = count + 1;
    return `${year}-${next.toString().padStart(4, "0")}`;
  }

  private async ensureEntityOwnership(userId: string, entityId: string) {
    const entity = await this.prisma.entity.findFirst({ where: { id: entityId, userId } });
    if (!entity) {
      throw new NotFoundException("ENTITY_NOT_FOUND");
    }
  }

  private async ensureInvoiceOwnership(userId: string, invoiceId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, entity: { userId } },
      include: { items: true, payments: true }
    });
    if (!invoice) {
      throw new NotFoundException("INVOICE_NOT_FOUND");
    }
    return invoice;
  }
}
