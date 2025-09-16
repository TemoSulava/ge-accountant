import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { PrismaModule } from "../../prisma/prisma.module";
import { BankController } from "./bank.controller";
import { BankService } from "./bank.service";

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }
    })
  ],
  controllers: [BankController],
  providers: [BankService],
  exports: [BankService]
})
export class BankModule {}
