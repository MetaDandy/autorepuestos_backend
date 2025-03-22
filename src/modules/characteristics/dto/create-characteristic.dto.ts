import { IsBoolean, IsString } from "class-validator";

export class CreateCharacteristicDto {
  @IsString()
  code: string;

  @IsString()
  color: string;

  @IsBoolean()
  is_complete: boolean;

  @IsString()
  state: string;
}
