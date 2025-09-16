import { Body, Controller, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AccessTokenGuard } from "../../common/guards/access-token.guard";
import { RequestUser } from "../../common/types/request-user";
import { BankService } from "./bank.service";
import { BankImportDto, UpdateTransactionDto } from "./dto/bank-import.dto";

@UseGuards(AccessTokenGuard)
@Controller()
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post("entities/:entityId/bank/import")
  @UseInterceptors(FileInterceptor("file"))
  import(
    @CurrentUser() user: RequestUser,
    @Param("entityId") entityId: string,
    @Body() dto: BankImportDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.bankService.import(user, entityId, dto, file);
  }

  @Get("entities/:entityId/transactions")
  list(@CurrentUser() user: RequestUser, @Param("entityId") entityId: string) {
    return this.bankService.list(user, entityId);
  }

  @Patch("transactions/:transactionId")
  update(
    @CurrentUser() user: RequestUser,
    @Param("transactionId") transactionId: string,
    @Body() dto: UpdateTransactionDto
  ) {
    return this.bankService.update(transactionId, user, dto);
  }
}
