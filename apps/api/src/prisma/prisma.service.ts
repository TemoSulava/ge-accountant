import { INestApplication, Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, "beforeExit"> implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: process.env.NODE_ENV === "production" ? [] : ["query", "info", "warn", "error"]
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log("Prisma connected");
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
