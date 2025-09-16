import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BullModule } from "@nestjs/bull";
import { ScheduleModule } from "@nestjs/schedule";
import { HealthController } from "./health.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { AuditModule } from "./modules/audit/audit.module";
import { BankModule } from "./modules/bank/bank.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { EntitiesModule } from "./modules/entities/entities.module";
import { ExpensesModule } from "./modules/expenses/expenses.module";
import { InvoicesModule } from "./modules/invoices/invoices.module";
import { RemindersModule } from "./modules/reminders/reminders.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { TaxModule } from "./modules/tax/tax.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? "localhost",
        port: Number(process.env.REDIS_PORT ?? 6379)
      }
    }),
    PrismaModule,
    AuditModule,
    AuthModule,
    EntitiesModule,
    CategoriesModule,
    InvoicesModule,
    ExpensesModule,
    BankModule,
    TaxModule,
    RemindersModule,
    ReportsModule
  ],
  controllers: [HealthController]
})
export class AppModule {}

