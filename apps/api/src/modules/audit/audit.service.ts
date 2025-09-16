import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditLogQueryDto } from "./dto/audit-log-query.dto";

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(userId: string, entityId: string, action: string, details: Record<string, unknown> = {}) {
    await this.prisma.auditLog.create({
      data: {
        userId,
        entityId,
        action,
        details: details as Prisma.JsonObject
      }
    });
  }

  async list(userId: string, entityId: string, query: AuditLogQueryDto) {
    await this.ensureEntityOwnership(userId, entityId);

    const where: Prisma.AuditLogWhereInput = {
      entityId
    };

    if (query.from || query.to) {
      where.createdAt = {};
      if (query.from) {
        const from = new Date(query.from);
        if (Number.isNaN(from.getTime())) {
          throw new BadRequestException("INVALID_FROM_DATE");
        }
        where.createdAt.gte = from;
      }
      if (query.to) {
        const to = new Date(query.to);
        if (Number.isNaN(to.getTime())) {
          throw new BadRequestException("INVALID_TO_DATE");
        }
        where.createdAt.lte = to;
      }
    }

    const limit = query.limit && query.limit > 0 ? query.limit : 50;

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit
    });
  }

  private async ensureEntityOwnership(userId: string, entityId: string) {
    const entity = await this.prisma.entity.findFirst({ where: { id: entityId, userId } });
    if (!entity) {
      throw new NotFoundException("ENTITY_NOT_FOUND");
    }
  }
}
