import { IsString, IsUUID } from "class-validator";

export class CreateProductTypeDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsUUID()
  category_type_id: string;
}
