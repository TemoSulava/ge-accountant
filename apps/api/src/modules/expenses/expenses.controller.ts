import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AccessTokenGuard } from "../../common/guards/access-token.guard";
import { RequestUser } from "../../common/types/request-user";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { ExpensesService } from "./expenses.service";

@UseGuards(AccessTokenGuard)
@Controller("entities/:entityId/expenses")
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  list(@CurrentUser() user: RequestUser, @Param("entityId") entityId: string) {
    return this.expensesService.list(user.id, entityId);
  }

  @Post()
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 10 * 1024 * 1024 } }))
  create(
    @CurrentUser() user: RequestUser,
    @Param("entityId") entityId: string,
    @Body() dto: CreateExpenseDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.expensesService.create(user.id, entityId, dto, file);
  }
}
