import { Type } from "class-transformer";
import { IsDateString, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateExpenseDto {
  @IsDateString()
  date!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount!: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
