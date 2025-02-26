import { IsString } from "class-validator";

export class CreateDepositDto {
  @IsString()
  place: string;

  @IsString()
  code: string;
}
