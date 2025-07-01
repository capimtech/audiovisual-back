import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAttachmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'O campo "filename" deve ser uma string não vazia',
  })
  filename: string;
}
