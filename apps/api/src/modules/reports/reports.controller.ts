import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AccessTokenGuard } from "../../common/guards/access-token.guard";
import { RequestUser } from "../../common/types/request-user";
import { ReportsQueryDto } from "./dto/reports-query.dto";
import { ReportsService } from "./reports.service";

@UseGuards(AccessTokenGuard)
@Controller("entities/:entityId/reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("pnl")
  profitAndLoss(
    @CurrentUser() user: RequestUser,
    @Param("entityId") entityId: string,
    @Query() query: ReportsQueryDto
  ) {
    return this.reportsService.profitAndLoss(user, entityId, query);
  }

  @Get("cashflow")
  cashflow(
    @CurrentUser() user: RequestUser,
    @Param("entityId") entityId: string,
    @Query() query: ReportsQueryDto
  ) {
    return this.reportsService.cashflow(user, entityId, query);
  }
}
