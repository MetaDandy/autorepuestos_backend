import { IsString, IsUUID } from "class-validator";

export class CreateModelDto {
  @IsString()
  name: string;

  @IsUUID()
  brand_id: string;
}
