import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AccessTokenGuard } from "../../common/guards/access-token.guard";
import { RequestUser } from "../../common/types/request-user";
import { CreateReminderDto } from "./dto/create-reminder.dto";
import { RemindersService } from "./reminders.service";

@UseGuards(AccessTokenGuard)
@Controller("entities/:entityId/reminders")
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Get()
  list(@CurrentUser() user: RequestUser, @Param("entityId") entityId: string) {
    return this.remindersService.list(user, entityId);
  }

  @Post()
  create(
    @CurrentUser() user: RequestUser,
    @Param("entityId") entityId: string,
    @Body() dto: CreateReminderDto
  ) {
    return this.remindersService.create(user, entityId, dto);
  }
}
