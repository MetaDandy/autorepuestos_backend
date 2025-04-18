import { IsString, IsUUID } from "class-validator";

export class CreateCategoryTypeDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsUUID()
  category_id: string;
}
