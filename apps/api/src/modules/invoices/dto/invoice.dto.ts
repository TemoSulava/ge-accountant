import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested
} from "class-validator";
import { InvoiceStatus } from "@prisma/client";

export class CreateInvoiceItemDto {
  @IsString()
  @MaxLength(200)
  description!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  quantity!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice!: number;
}

export class CreateInvoiceDto {
  @IsString()
  @MaxLength(100)
  clientName!: string;

  @IsOptional()
  @IsEmail()
  clientEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  clientAddress?: string;

  @IsISO8601()
  issueDate!: string;

  @IsOptional()
  @IsISO8601()
  dueDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items!: CreateInvoiceItemDto[];
}

export class UpdateInvoiceStatusDto {
  @IsEnum(InvoiceStatus)
  status!: InvoiceStatus;
}

export class CreatePaymentDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount!: number;

  @IsISO8601()
  date!: string;

  @IsString()
  @MaxLength(50)
  method!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  reference?: string;
}
