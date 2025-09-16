import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { HealthController } from "./health.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { BankModule } from "./modules/bank/bank.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { EntitiesModule } from "./modules/entities/entities.module";
import { ExpensesModule } from "./modules/expenses/expenses.module";
import { InvoicesModule } from "./modules/invoices/invoices.module";
import { TaxModule } from "./modules/tax/tax.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    EntitiesModule,
    CategoriesModule,
    InvoicesModule,
    ExpensesModule,
    BankModule,
    TaxModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
