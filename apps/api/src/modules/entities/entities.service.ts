import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AuditService } from "../audit/audit.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateEntityDto } from "./dto/create-entity.dto";
import { UpdateEntityDto } from "./dto/update-entity.dto";

@Injectable()
export class EntitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async findAll(userId: string) {
    return this.prisma.entity.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" }
    });
  }

  async findOne(userId: string, id: string) {
    const entity = await this.prisma.entity.findFirst({
      where: { id, userId }
    });
    if (!entity) {
      throw new NotFoundException("ENTITY_NOT_FOUND");
    }
    return entity;
  }

  async create(userId: string, dto: CreateEntityDto) {
    const data: Prisma.EntityCreateInput = {
      user: { connect: { id: userId } },
      displayName: dto.displayName,
      taxStatus: dto.taxStatus,
      regimeFrom: dto.regimeFrom ? new Date(dto.regimeFrom) : undefined,
      annualThreshold: dto.annualThreshold,
      iban: dto.iban,
      bankName: dto.bankName,
      taxId: dto.taxId,
      address: dto.address,
      timezone: dto.timezone ?? "Asia/Tbilisi"
    };

    const entity = await this.prisma.entity.create({ data });
    await this.audit.log(userId, entity.id, "entity:create", { entityId: entity.id });
    return entity;
  }

  async update(userId: string, id: string, dto: UpdateEntityDto) {
    await this.ensureOwnership(userId, id);
    const entity = await this.prisma.entity.update({
      where: { id },
      data: {
        displayName: dto.displayName,
        taxStatus: dto.taxStatus,
        regimeFrom: dto.regimeFrom ? new Date(dto.regimeFrom) : undefined,
        annualThreshold: dto.annualThreshold,
        iban: dto.iban,
        bankName: dto.bankName,
        taxId: dto.taxId,
        address: dto.address,
        timezone: dto.timezone
      }
    });

    await this.audit.log(userId, id, "entity:update", { entityId: id, changes: dto });
    return entity;
  }

  private async ensureOwnership(userId: string, id: string) {
    const entity = await this.prisma.entity.findFirst({ where: { id, userId } });
    if (!entity) {
      throw new NotFoundException("ENTITY_NOT_FOUND");
    }
  }
}
