import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class UpdatePriceDepositProductDto {
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2
  })
  @Type(() => Number)
  price: number;
}