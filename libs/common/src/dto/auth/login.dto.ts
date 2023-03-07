import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Email of the user', example: 'test@test.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @ApiProperty({ description: 'Password of the user', example: 'password' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;
}
