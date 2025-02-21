import { IsString } from "class-validator";

export class CreateCategoryTypeDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  category_id: string;
}
