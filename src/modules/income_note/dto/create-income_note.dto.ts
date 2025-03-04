import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";

class IncomeDetailDto {
  @IsString()
  deposit_product_id: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  total: number;
}

export class CreateIncomeNoteDto {
  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncomeDetailDto)
  details: IncomeDetailDto[];
}
