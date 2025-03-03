import { IsNumber, IsPositive, IsString } from "class-validator";

export class CreateMetricsCodeDto {
  @IsString()
  document: string;

  @IsString()
  prefix: string;

  @IsString()
  last_number: string;

  @IsNumber()
  @IsPositive()
  zeros: number;
}
