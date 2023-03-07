import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TokensResponseDto {
  @ApiProperty({ description: 'Access token' })
  @IsString()
  accessToken: string;

  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  refreshToken: string;
}
