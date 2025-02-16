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
  name: string;

  @IsString()
  phone: string;

  @IsString()
  address?: string;
}
