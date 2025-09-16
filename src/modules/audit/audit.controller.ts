import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AccessTokenGuard } from "../../common/guards/access-token.guard";
import { RequestUser } from "../../common/types/request-user";
import { AuditService } from "./audit.service";
import { AuditLogQueryDto } from "./dto/audit-log-query.dto";

@UseGuards(AccessTokenGuard)
@Controller("entities/:entityId/audit-logs")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  list(
    @CurrentUser() user: RequestUser,
    @Param("entityId") entityId: string,
    @Query() query: AuditLogQueryDto
  ) {
    return this.auditService.list(user, entityId, query);
  }
}
