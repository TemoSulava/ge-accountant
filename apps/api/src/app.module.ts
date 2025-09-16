import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { HealthController } from "./health.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { EntitiesModule } from "./modules/entities/entities.module";
import { ExpensesModule } from "./modules/expenses/expenses.module";
import { InvoicesModule } from "./modules/invoices/invoices.module";
import { PrismaModule } from "./prisma/prisma.module";
import { BankModule } from './modules/bank.module';
import { BankService } from './modules/bank.service';
import { BankController } from './modules/bank.controller';

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
    BankModule
  ],
  controllers: [HealthController, BankController],
  providers: [BankService]
})
export class AppModule {}

