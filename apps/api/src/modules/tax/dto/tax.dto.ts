import { IsDateString, IsOptional } from "class-validator";

export class ClosePeriodDto {
  @IsOptional()
  @IsDateString()
  periodStart?: string;

  @IsOptional()
  @IsDateString()
  periodEnd?: string;
}

export class PayTaxPeriodDto {
  @IsOptional()
  @IsDateString()
  paidAt?: string;
}
