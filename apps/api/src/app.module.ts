import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { HealthController } from "./health.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { EntitiesModule } from "./modules/entities/entities.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    EntitiesModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
