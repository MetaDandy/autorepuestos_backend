import { Type } from "class-transformer";
import { IsNumber, IsString, IsUUID } from "class-validator";

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  code: string;

  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2
  })
  @Type(() => Number)
  price: number;

  @IsString()
  technology: string;

  @IsUUID()
  product_type_id: string;
}
