import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { parse } from "csv-parse/sync";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { RequestUser } from "../../common/types/request-user";
import { AuditService } from "../audit/audit.service";
import { BankImportDto, MappingDto, SupportedBank, UpdateTransactionDto } from "./dto/bank-import.dto";

interface RawTransaction {
  date: string;
  amount: number;
  currency: string;
  description: string;
  counterparty?: string;
  raw: Record<string, string>;
}

interface RuleCondition {
  description_contains?: string[];
}

interface RuleAction {
  setCategoryId?: string;
  setCategoryByName?: string;
}

interface ParsedRule {
  condition: RuleCondition;
  action: RuleAction;
}

interface MappingConfig {
  date: string;
  amount?: string;
  debit?: string;
  credit?: string;
  currency?: string;
  description: string;
  counterparty?: string;
}

@Injectable()
export class BankService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async import(user: RequestUser, entityId: string, dto: BankImportDto, file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("CSV_FILE_REQUIRED");
    }

    await this.ensureEntityOwnership(user.id, entityId);

    const text = file.buffer.toString("utf8");
    const records = this.parseCsv(text, dto);

    if (!records.length) {
      throw new BadRequestException("NO_TRANSACTIONS_FOUND");
    }

    const dbRules = await this.prisma.rule.findMany({
      where: { entityId },
      orderBy: { priority: "asc" }
    });
    const rules: ParsedRule[] = dbRules.map((rule) => ({
      condition: (rule.condition ?? {}) as RuleCondition,
      action: (rule.action ?? {}) as RuleAction
    }));

    const categories = await this.prisma.category.findMany({ where: { entityId } });
    const categoryByName = new Map(categories.map((category) => [category.name.toLowerCase(), category.id]));

    const data = records.map((record) => this.mapToPrisma(entityId, record, rules, categoryByName));

    const created = await this.prisma.bankTransaction.createMany({ data });

    await this.audit.log(user.id, entityId, "bank:import", {
      bank: dto.bank,
      transactions: created.count
    });

    return { imported: created.count };
  }

  async list(user: RequestUser, entityId: string) {
    await this.ensureEntityOwnership(user.id, entityId);
    return this.prisma.bankTransaction.findMany({
      where: { entityId },
      include: { category: true },
      orderBy: { date: "desc" }
    });
  }

  async update(transactionId: string, user: RequestUser, dto: UpdateTransactionDto) {
    const transaction = await this.prisma.bankTransaction.findFirst({
      where: { id: transactionId, entity: { userId: user.id } }
    });

    if (!transaction) {
      throw new NotFoundException("TRANSACTION_NOT_FOUND");
    }

    const updated = await this.prisma.bankTransaction.update({
      where: { id: transactionId },
      data: {
        categoryId: dto.categoryId,
        linkedInvoiceId: dto.linkedInvoiceId
      },
      include: { category: true }
    });

    await this.audit.log(user.id, updated.entityId, "bank:updateTransaction", {
      transactionId,
      categoryId: dto.categoryId,
      linkedInvoiceId: dto.linkedInvoiceId
    });

    return updated;
  }

  private parseCsv(text: string, dto: BankImportDto): RawTransaction[] {
    const mapping = this.resolveMapping(dto.bank, dto.mapping);

    const rows = parse(text, {
      skip_empty_lines: true,
      columns: true,
      trim: true
    }) as Record<string, string>[];

    return rows
      .map((row) => this.normalizeRow(row, mapping))
      .filter((item): item is RawTransaction => !!item);
  }
  private resolveMapping(bank: SupportedBank, mapping?: MappingDto): MappingConfig {
    if (mapping) {
      return {
        date: mapping.date,
        amount: mapping.amount ?? "",
        debit: mapping.debit ?? "",
        credit: mapping.credit ?? "",
        currency: mapping.currency ?? "",
        description: mapping.description,
        counterparty: mapping.counterparty ?? ""
      };
    }

    switch (bank) {
      case SupportedBank.BOG:
        return {
          date: "Date",
          amount: "Amount",
          currency: "Currency",
          description: "Description",
          counterparty: "Counterparty"
        };
      case SupportedBank.TBC:
        return {
          date: "TxnDate",
          debit: "Debit",
          credit: "Credit",
          currency: "Currency",
          description: "Details",
          counterparty: "Account"
        };
      default:
        throw new BadRequestException("MAPPING_REQUIRED");
    }
  }
  private normalizeRow(row: Record<string, string>, mapping: MappingConfig): RawTransaction | null {
    const dateValue = row[mapping.date];
    if (!dateValue) {
      return null;
    }

    const currency = mapping.currency ? row[mapping.currency] || "GEL" : "GEL";
    const description = row[mapping.description] ?? "";
    const counterparty = mapping.counterparty ? row[mapping.counterparty] : undefined;

    let amountRaw: number | null = null;
    if (mapping.amount) {
      amountRaw = Number(row[mapping.amount]);
    } else {
      const debit = mapping.debit ? Number(row[mapping.debit] || 0) : 0;
      const credit = mapping.credit ? Number(row[mapping.credit] || 0) : 0;
      amountRaw = credit - debit;
    }

    if (!amountRaw || Number.isNaN(amountRaw)) {
      return null;
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return {
      date: date.toISOString(),
      amount: Math.round(amountRaw * 100) / 100,
      currency,
      description,
      counterparty,
      raw: row
    };
  }

  private mapToPrisma(
    entityId: string,
    record: RawTransaction,
    rules: ParsedRule[],
    categoryByName: Map<string, string>
  ): Prisma.BankTransactionCreateManyInput {
    const categoryId = this.applyRules(record, rules, categoryByName);
    return {
      entityId,
      date: new Date(record.date),
      amount: new Prisma.Decimal(record.amount.toFixed(2)),
      currency: record.currency ?? "GEL",
      description: record.description,
      counterparty: record.counterparty,
      raw: record.raw as Prisma.JsonObject,
      categoryId
    };
  }
  private applyRules(
    record: RawTransaction,
    rules: ParsedRule[],
    categoryByName: Map<string, string>
  ): string | undefined {
    const description = record.description?.toLowerCase() ?? "";

    for (const rule of rules) {
      const contains = rule.condition.description_contains;
      if (contains?.length) {
        const matches = contains.some((token) => description.includes(token.toLowerCase()));
        if (matches) {
          if (rule.action.setCategoryId) {
            return rule.action.setCategoryId;
          }
          if (rule.action.setCategoryByName) {
            const candidate = rule.action.setCategoryByName.toLowerCase();
            const category = categoryByName.get(candidate);
            if (category) {
              return category;
            }
          }
        }
      }
    }

    return undefined;
  }

  private async ensureEntityOwnership(userId: string, entityId: string) {
    const entity = await this.prisma.entity.findFirst({ where: { id: entityId, userId } });
    if (!entity) {
      throw new NotFoundException("ENTITY_NOT_FOUND");
    }
  }
}
