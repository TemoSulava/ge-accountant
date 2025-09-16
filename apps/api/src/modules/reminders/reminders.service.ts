import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Queue } from "bull";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { RequestUser } from "../../common/types/request-user";
import { CreateReminderDto } from "./dto/create-reminder.dto";

export const REMINDER_QUEUE = "reminders";
export const SEND_REMINDER_JOB = "send-reminder";

@Injectable()
export class RemindersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    @InjectQueue(REMINDER_QUEUE) private readonly reminderQueue: Queue
  ) {}

  async list(user: RequestUser, entityId: string) {
    await this.ensureEntityOwnership(user.id, entityId);
    return this.prisma.reminder.findMany({
      where: { entityId },
      orderBy: { dueDate: "asc" }
    });
  }

  async create(user: RequestUser, entityId: string, dto: CreateReminderDto) {
    await this.ensureEntityOwnership(user.id, entityId);

    const reminder = await this.prisma.reminder.create({
      data: {
        entityId,
        type: dto.type,
        dueDate: new Date(dto.dueDate),
        channel: dto.channel,
        payload: dto.payload ? (dto.payload as Prisma.JsonObject) : undefined
      }
    });

    await this.audit.log(user.id, entityId, "reminder:create", {
      reminderId: reminder.id,
      dueDate: reminder.dueDate.toISOString(),
      channel: reminder.channel
    });

    await this.scheduleReminder(reminder.id, reminder.dueDate);
    return reminder;
  }

  async markSent(reminderId: string) {
    return this.prisma.reminder.update({
      where: { id: reminderId },
      data: { sentAt: new Date() }
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM, { timeZone: process.env.DEFAULT_TZ ?? "Asia/Tbilisi" })
  async enqueueUpcomingReminders() {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const reminders = await this.prisma.reminder.findMany({
      where: {
        sentAt: null,
        dueDate: {
          gte: now,
          lte: nextWeek
        }
      }
    });

    await Promise.all(reminders.map((reminder) => this.scheduleReminder(reminder.id, reminder.dueDate)));
  }

  private async scheduleReminder(reminderId: string, dueDate: Date) {
    const delay = dueDate.getTime() - Date.now();
    const jobId = `reminder:${reminderId}`;

    await this.reminderQueue.add(SEND_REMINDER_JOB, { reminderId }, {
      jobId,
      delay: Math.max(delay, 0),
      removeOnComplete: true,
      removeOnFail: true
    });
  }

  private async ensureEntityOwnership(userId: string, entityId: string) {
    const entity = await this.prisma.entity.findFirst({ where: { id: entityId, userId } });
    if (!entity) {
      throw new NotFoundException("ENTITY_NOT_FOUND");
    }
    return entity;
  }
}






