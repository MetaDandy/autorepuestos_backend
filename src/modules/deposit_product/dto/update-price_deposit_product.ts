import { IsString } from "class-validator";

export class UpdatePriceDepositProductDto {
  @IsString()
  price: string;
}