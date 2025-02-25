import { IsString, IsUUID } from "class-validator";

export class CreateCompatibilityDto {
  @IsString()
  year: string;

  @IsUUID()
  product_id: string;

  @IsUUID()
  model_id: string;
}
