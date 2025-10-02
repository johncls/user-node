import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
  // auth/dto/login.dto.ts
  export class LoginDto {
    @IsEmail({}, { message: 'El email debe tener un formato válido' })
    email: string;

    @IsString({ message: 'La contraseña es requerida' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @MaxLength(50, { message: 'La contraseña no puede exceder 50 caracteres' })
    password: string;
  }
  