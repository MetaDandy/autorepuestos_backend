import { ArrayNotEmpty, IsArray, IsString, IsUUID } from "class-validator";

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty({
    message: 'El rol debe tener al menos un permiso'
  })
  @IsUUID(
    "all",
    {
      each: true, 
      message: "Cada permiso debe ser un UUID válido"
    }
  )
  permissions: string[];
}
