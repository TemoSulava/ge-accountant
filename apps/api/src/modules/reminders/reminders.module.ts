import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { PrismaModule } from "../../prisma/prisma.module";
import { RemindersController } from "./reminders.controller";
import { RemindersService } from "./reminders.service";
import { ReminderProcessor } from "./processors/reminder.processor";

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: "reminders"
    })
  ],
  controllers: [RemindersController],
  providers: [RemindersService, ReminderProcessor],
  exports: [RemindersService]
})
export class RemindersModule {}
