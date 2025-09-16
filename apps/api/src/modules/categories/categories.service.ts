import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async listByEntity(userId: string, entityId: string) {
    await this.ensureEntityOwnership(userId, entityId);
    return this.prisma.category.findMany({
      where: { entityId },
      orderBy: { name: "asc" }
    });
  }

  async create(userId: string, entityId: string, dto: CreateCategoryDto) {
    await this.ensureEntityOwnership(userId, entityId);

    const data: Prisma.CategoryCreateInput = {
      entity: { connect: { id: entityId } },
      name: dto.name,
      type: dto.type
    };

    const category = await this.prisma.category.create({ data });
    await this.audit.log(userId, entityId, "category:create", {
      categoryId: category.id,
      name: category.name,
      type: category.type
    });
    return category;
  }

  async update(userId: string, entityId: string, categoryId: string, dto: UpdateCategoryDto) {
    await this.ensureCategoryOwnership(userId, entityId, categoryId);

    const category = await this.prisma.category.update({
      where: { id: categoryId },
      data: {
        name: dto.name,
        type: dto.type
      }
    });

    await this.audit.log(userId, entityId, "category:update", {
      categoryId,
      changes: dto
    });

    return category;
  }

  private async ensureEntityOwnership(userId: string, entityId: string) {
    const entity = await this.prisma.entity.findFirst({ where: { id: entityId, userId } });
    if (!entity) {
      throw new NotFoundException("ENTITY_NOT_FOUND");
    }
  }

  private async ensureCategoryOwnership(userId: string, entityId: string, categoryId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, entityId, entity: { userId } }
    });
    if (!category) {
      throw new NotFoundException("CATEGORY_NOT_FOUND");
    }
  }
}
