import { IsString, IsUUID } from "class-validator";

export class CreateDepositProductDto {
  @IsString()
  price: string;

  @IsUUID()
  product_id: string;

  @IsUUID()
  deposit_id: string;

  @IsUUID()
  characteristic_id: string;
}
