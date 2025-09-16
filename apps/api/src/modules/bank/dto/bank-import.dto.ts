import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

enum SupportedBank {
  BOG = "BOG",
  TBC = "TBC",
  OTHER = "OTHER"
}

class MappingDto {
  @IsString()
  date!: string;

  @IsOptional()
  @IsString()
  debit?: string;

  @IsOptional()
  @IsString()
  credit?: string;

  @IsOptional()
  @IsString()
  amount?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  counterparty?: string;
}

export class BankImportDto {
  @IsEnum(SupportedBank)
  bank!: SupportedBank;

  @IsOptional()
  @ValidateNested()
  @Type(() => MappingDto)
  mapping?: MappingDto;
}

export class UpdateTransactionDto {
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  linkedInvoiceId?: string;
}

export { SupportedBank, MappingDto };
