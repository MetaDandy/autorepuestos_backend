import { IsString } from "class-validator";

export class CreateCharacteristicDto {
  @IsString()
  code: string;

  @IsString()
  color: string;

  @IsString()
  is_complete: boolean;

  @IsString()
  state: string;
}
