import { IsUUID } from "class-validator";

export class CreateDepositProductDto {
  @IsUUID()
  product_id: string;

  @IsUUID()
  deposit_id: string;

  @IsUUID()
  characteristic_id: string;
}
