import { IsOptional, IsString, IsUrl, ValidateIf } from "class-validator";

export class CreateBrandDto {
  @IsString()
  name: string;

  @ValidateIf((o) => !o.logoFile)
  @IsOptional()
  @IsUrl({}, { message: 'Debe ser una URL válida o un archivo' })
  logo?: string | null;
}
