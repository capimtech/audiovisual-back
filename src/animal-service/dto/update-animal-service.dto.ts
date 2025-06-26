import { PartialType } from '@nestjs/swagger';
import { CreateAnimalServiceDto } from './create-animal-service.dto';

export class UpdateAnimalServiceDto extends PartialType(
  CreateAnimalServiceDto,
) {}
