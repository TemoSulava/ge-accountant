import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AccessTokenGuard } from "../../common/guards/access-token.guard";
import { RequestUser } from "../../common/types/request-user";
import { CreateEntityDto } from "./dto/create-entity.dto";
import { UpdateEntityDto } from "./dto/update-entity.dto";
import { EntitiesService } from "./entities.service";

@UseGuards(AccessTokenGuard)
@Controller("entities")
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Get()
  findAll(@CurrentUser() user: RequestUser) {
    return this.entitiesService.findAll(user.id);
  }

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateEntityDto) {
    return this.entitiesService.create(user.id, dto);
  }

  @Get(":id")
  findOne(@CurrentUser() user: RequestUser, @Param("id") id: string) {
    return this.entitiesService.findOne(user.id, id);
  }

  @Patch(":id")
  update(@CurrentUser() user: RequestUser, @Param("id") id: string, @Body() dto: UpdateEntityDto) {
    return this.entitiesService.update(user.id, id, dto);
  }
}
