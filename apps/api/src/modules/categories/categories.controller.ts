import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AccessTokenGuard } from "../../common/guards/access-token.guard";
import { RequestUser } from "../../common/types/request-user";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CategoriesService } from "./categories.service";

@UseGuards(AccessTokenGuard)
@Controller("entities/:entityId/categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  list(@CurrentUser() user: RequestUser, @Param("entityId") entityId: string) {
    return this.categoriesService.listByEntity(user.id, entityId);
  }

  @Post()
  create(
    @CurrentUser() user: RequestUser,
    @Param("entityId") entityId: string,
    @Body() dto: CreateCategoryDto
  ) {
    return this.categoriesService.create(user.id, entityId, dto);
  }

  @Patch(":categoryId")
  update(
    @CurrentUser() user: RequestUser,
    @Param("entityId") entityId: string,
    @Param("categoryId") categoryId: string,
    @Body() dto: UpdateCategoryDto
  ) {
    return this.categoriesService.update(user.id, entityId, categoryId, dto);
  }
}
