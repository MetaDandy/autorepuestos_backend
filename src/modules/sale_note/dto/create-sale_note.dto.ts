import { Type } from "class-transformer";
import { IsArray, IsNumber, IsPositive, IsString, ValidateNested } from "class-validator";

class SaleDetailDto {
  @IsString()
  deposit_product_id: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}

export class CreateSaleNoteDto {
  @IsString()
  description: string;
  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleDetailDto)
  details: SaleDetailDto[];
}
