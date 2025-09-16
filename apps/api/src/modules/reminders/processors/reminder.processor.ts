import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { Reminder, User } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { RemindersService, REMINDER_QUEUE, SEND_REMINDER_JOB } from "../reminders.service";

interface ReminderJobData {
  reminderId: string;
}

@Processor(REMINDER_QUEUE)
export class ReminderProcessor {
  constructor(private readonly prisma: PrismaService, private readonly remindersService: RemindersService) {}

  @Process(SEND_REMINDER_JOB)
  async handleSend(job: Job<ReminderJobData>) {
    const reminder = await this.prisma.reminder.findUnique({
      where: { id: job.data.reminderId },
      include: { entity: { include: { user: true } } }
    });

    if (!reminder || reminder.sentAt) {
      return;
    }

    await this.dispatchNotification(reminder, reminder.entity.user);
    await this.remindersService.markSent(reminder.id);
  }

  private async dispatchNotification(reminder: Reminder & { entity: { user: User } }, user: User) {
    // Placeholder notification logic. In production, integrate SendGrid/Telegram.
    const target = reminder.channel === "telegram" ? "Telegram" : user.email;
    console.info(`Dispatching reminder ${reminder.id} to ${target} for due date ${reminder.dueDate.toISOString()}`);
  }
}
