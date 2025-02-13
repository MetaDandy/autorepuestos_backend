import { IsEmail, IsNotEmpty, IsString, IsUUID, MinLength } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsUUID()
  role_id: string;

  @IsString()
  full_name: string;

  @IsString()
  phone?: string;

  @IsString()
  address?: string;
}
