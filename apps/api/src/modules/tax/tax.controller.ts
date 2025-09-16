import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AccessTokenGuard } from "../../common/guards/access-token.guard";
import { RequestUser } from "../../common/types/request-user";
import { ClosePeriodDto, PayTaxPeriodDto } from "./dto/tax.dto";
import { TaxService } from "./tax.service";

@UseGuards(AccessTokenGuard)
@Controller()
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Get("entities/:entityId/tax/periods")
  list(@CurrentUser() user: RequestUser, @Param("entityId") entityId: string) {
    return this.taxService.list(user, entityId);
  }

  @Post("entities/:entityId/tax/close")
  close(
    @CurrentUser() user: RequestUser,
    @Param("entityId") entityId: string,
    @Body() dto: ClosePeriodDto
  ) {
    return this.taxService.closePeriod(user, entityId, dto);
  }

  @Patch("tax/periods/:taxPeriodId/pay")
  markPaid(
    @CurrentUser() user: RequestUser,
    @Param("taxPeriodId") taxPeriodId: string,
    @Body() dto: PayTaxPeriodDto
  ) {
    return this.taxService.markPaid(user, taxPeriodId, dto);
  }

  @Get("entities/:entityId/export/rs-ge")
  export(
    @CurrentUser() user: RequestUser,
    @Param("entityId") entityId: string,
    @Query("period") period: string
  ) {
    return this.taxService.exportRs(user, entityId, period);
  }
}
