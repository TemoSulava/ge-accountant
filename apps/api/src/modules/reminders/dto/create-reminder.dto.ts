import { IsDateString, IsEnum, IsObject, IsOptional, IsString } from "class-validator";

export enum ReminderChannel {
  EMAIL = "email",
  TELEGRAM = "telegram"
}

export class CreateReminderDto {
  @IsString()
  type!: string;

  @IsDateString()
  dueDate!: string;

  @IsEnum(ReminderChannel)
  channel!: ReminderChannel;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
