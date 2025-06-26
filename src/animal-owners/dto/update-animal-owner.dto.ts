import { PartialType } from '@nestjs/swagger';
import { CreateAnimalOwnerDto } from './create-animal-owner.dto';

export class UpdateAnimalOwnerDto extends PartialType(CreateAnimalOwnerDto) {}
