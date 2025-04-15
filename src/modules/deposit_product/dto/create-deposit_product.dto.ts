import { Type } from "class-transformer";
import { IsNumber, IsUUID } from "class-validator";

export class CreateDepositProductDto {
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2
  })
  @Type(() => Number)
  price: number;

  @IsUUID()
  product_id: string;

  @IsUUID()
  deposit_id: string;

  @IsUUID()
  characteristic_id: string;
}
