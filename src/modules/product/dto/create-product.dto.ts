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
  price: number;

  @IsString()
  color: string;

  @IsBoolean()
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
