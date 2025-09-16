import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateExpenseDto } from "./dto/create-expense.dto";

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string, entityId: string) {
    await this.ensureEntityOwnership(userId, entityId);
    return this.prisma.expense.findMany({
      where: { entityId },
      include: { category: true },
      orderBy: { date: "desc" }
    });
  }

  async create(
    userId: string,
    entityId: string,
    dto: CreateExpenseDto,
    file?: Express.Multer.File
  ) {
    await this.ensureEntityOwnership(userId, entityId);

    const receiptInfo = this.prepareReceipt(file);

    return this.prisma.expense.create({
      data: {
        entityId,
        date: new Date(dto.date),
        amount: new Prisma.Decimal(dto.amount.toFixed(2)),
        currency: dto.currency ?? "GEL",
        categoryId: dto.categoryId,
        description: dto.description,
        receiptUrl: receiptInfo?.url ?? null,
        ocrText: receiptInfo?.ocrText ?? null
      },
      include: { category: true }
    });
  }

  private prepareReceipt(file?: Express.Multer.File) {
    if (!file) {
      return null;
    }

    // Placeholder storage logic; real implementation will upload to S3/MinIO
    const url = `s3://pending/${file.originalname}`;
    const ocrText = this.extractTextStub(file);
    return { url, ocrText };
  }

  private extractTextStub(file: Express.Multer.File) {
    const firstBytes = file.buffer?.toString("utf8", 0, Math.min(file.size, 64)) ?? "";
    return `OCR_STUB:${file.originalname}:${firstBytes.length}`;
  }

  private async ensureEntityOwnership(userId: string, entityId: string) {
    const entity = await this.prisma.entity.findFirst({ where: { id: entityId, userId } });
    if (!entity) {
      throw new NotFoundException("ENTITY_NOT_FOUND");
    }
  }
}
