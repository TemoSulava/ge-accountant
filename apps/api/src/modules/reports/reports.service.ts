import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InvoiceStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { RequestUser } from "../../common/types/request-user";
import { ReportsQueryDto } from "./dto/reports-query.dto";

interface DateRange {
  from: Date;
  to: Date;
}

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async profitAndLoss(user: RequestUser, entityId: string, query: ReportsQueryDto) {
    await this.ensureEntityOwnership(user.id, entityId);
    const range = this.resolveRange(query);

    const invoices = await this.prisma.invoice.findMany({
      where: {
        entityId,
        status: {
          in: [InvoiceStatus.ISSUED, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.PAID]
        },
        issueDate: {
          gte: range.from,
          lt: range.to
        }
      },
      select: {
        issueDate: true,
        total: true,
        currency: true
      }
    });

    const expenses = await this.prisma.expense.findMany({
      where: {
        entityId,
        date: {
          gte: range.from,
          lt: range.to
        }
      },
      select: {
        date: true,
        amount: true,
        currency: true,
        description: true
      }
    });

    const incomeTotal = invoices.reduce((sum, invoice) => sum + Number(invoice.total), 0);
    const expenseTotal = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

    return {
      range: this.serializeRange(range),
      currency: "GEL",
      income: {
        total: Number(incomeTotal.toFixed(2)),
        items: invoices.map((invoice) => ({
          date: invoice.issueDate.toISOString(),
          amount: Number(invoice.total),
          currency: invoice.currency
        }))
      },
      expenses: {
        total: Number(expenseTotal.toFixed(2)),
        items: expenses.map((expense) => ({
          date: expense.date.toISOString(),
          amount: Number(expense.amount),
          currency: expense.currency,
          description: expense.description
        }))
      },
      net: Number((incomeTotal - expenseTotal).toFixed(2))
    };
  }

  async cashflow(user: RequestUser, entityId: string, query: ReportsQueryDto) {
    await this.ensureEntityOwnership(user.id, entityId);
    const range = this.resolveRange(query);

    const transactions = await this.prisma.bankTransaction.findMany({
      where: {
        entityId,
        date: {
          gte: range.from,
          lt: range.to
        }
      },
      select: {
        date: true,
        amount: true,
        description: true
      },
      orderBy: { date: "asc" }
    });

    let inflow = 0;
    let outflow = 0;
    const inflowItems: Array<{ date: string; amount: number; description: string }> = [];
    const outflowItems: Array<{ date: string; amount: number; description: string }> = [];

    transactions.forEach((transaction) => {
      const amount = Number(transaction.amount);
      const item = {
        date: transaction.date.toISOString(),
        amount: Math.abs(amount),
        description: transaction.description
      };
      if (amount >= 0) {
        inflow += amount;
        inflowItems.push(item);
      } else {
        outflow += Math.abs(amount);
        outflowItems.push(item);
      }
    });

    return {
      range: this.serializeRange(range),
      currency: "GEL",
      inflow: {
        total: Number(inflow.toFixed(2)),
        items: inflowItems
      },
      outflow: {
        total: Number(outflow.toFixed(2)),
        items: outflowItems
      },
      net: Number((inflow - outflow).toFixed(2))
    };
  }

  private resolveRange(query: ReportsQueryDto): DateRange {
    const from = query.from ? new Date(query.from) : new Date(0);
    const to = query.to ? new Date(query.to) : new Date();

    if (Number.isNaN(from.getTime())) {
      throw new BadRequestException("INVALID_FROM_DATE");
    }

    if (Number.isNaN(to.getTime()) || to <= from) {
      throw new BadRequestException("INVALID_TO_DATE");
    }

    return { from, to };
  }

  private serializeRange(range: DateRange) {
    return {
      from: range.from.toISOString(),
      to: range.to.toISOString()
    };
  }

  private async ensureEntityOwnership(userId: string, entityId: string) {
    const entity = await this.prisma.entity.findFirst({ where: { id: entityId, userId } });
    if (!entity) {
      throw new NotFoundException("ENTITY_NOT_FOUND");
    }
  }
}

