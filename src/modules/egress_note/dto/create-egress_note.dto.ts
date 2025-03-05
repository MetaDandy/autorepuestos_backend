import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";

class EgressDetailDto {
  @IsString()
  deposit_product_id: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  total: number;
}

export class CreateEgressNoteDto {
  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EgressDetailDto)
  details: EgressDetailDto[];
}
