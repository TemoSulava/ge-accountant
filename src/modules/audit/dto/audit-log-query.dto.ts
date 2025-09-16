import { IsInt, IsOptional, IsDateString } from "class-validator";

export class AuditLogQueryDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsInt()
  limit?: number;
}
