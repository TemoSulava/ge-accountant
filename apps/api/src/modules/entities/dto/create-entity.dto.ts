import { IsDateString, IsEnum, IsInt, IsOptional, IsPositive, IsString, MaxLength, MinLength } from "class-validator";
import { TaxStatus } from "@prisma/client";

export class CreateEntityDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  displayName!: string;

  @IsOptional()
  @IsEnum(TaxStatus)
  taxStatus?: TaxStatus;

  @IsOptional()
  @IsDateString()
  regimeFrom?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  annualThreshold?: number;

  @IsOptional()
  @IsString()
  @MaxLength(34)
  iban?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  bankName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  taxId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  timezone?: string;
}
