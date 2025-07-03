import { PartialType } from '@nestjs/swagger';
import { CreateFilmRequestDto } from './create-film-request.dto';

export class UpdateFilmRequestDto extends PartialType(CreateFilmRequestDto) {}
