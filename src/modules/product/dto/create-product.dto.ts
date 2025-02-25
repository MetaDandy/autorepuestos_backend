import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsString, IsUUID } from "class-validator";

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
  color: string;

  @IsBoolean()
  @Type(() => Boolean)
  is_complete: boolean;

  @IsString()
  state: string;

  @IsString()
  technology: string;

  @IsString()
  material: string;

  @IsUUID()
  product_type_id: string;
}
