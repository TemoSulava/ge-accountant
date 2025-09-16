import { IsEnum, IsString, MaxLength } from "class-validator";
import { CategoryType } from "@prisma/client";

export class CreateCategoryDto {
  @IsString()
  @MaxLength(50)
  name!: string;

  @IsEnum(CategoryType)
  type!: CategoryType;
}
