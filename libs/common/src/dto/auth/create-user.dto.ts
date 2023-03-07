import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Email of the user', example: 'test@test.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @ApiProperty({ description: 'Password of the user', example: 'password' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;
  @ApiProperty({ description: 'Name of the user', example: 'Test User' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  name: string;

  @ApiProperty({ description: 'Phone of the user', example: '12345678' })
  @IsString()
  phone: string;
}
