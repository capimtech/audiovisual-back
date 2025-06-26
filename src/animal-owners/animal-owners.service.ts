import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnimalOwnerDto } from './dto/create-animal-owner.dto';
import { UpdateAnimalOwnerDto } from './dto/update-animal-owner.dto';
import { AnimalOwner } from './entities/animal-owner.entity';
import { AnimalOwnerRepository } from './entities/animal-owner.repository';

@Injectable()
export class AnimalOwnersService {
  constructor(private readonly animalOwnerRepository: AnimalOwnerRepository) {}

  async create(dto: CreateAnimalOwnerDto): Promise<AnimalOwner> {
    return await this.animalOwnerRepository.create(dto);
  }

  async findAll(): Promise<AnimalOwner[]> {
    const [data] = await this.animalOwnerRepository.findMany({ filter: {} });
    return data;
  }

  async findOne(id: string): Promise<AnimalOwner> {
    const found = await this.animalOwnerRepository.rawFindOne({
      where: { id },
    });
    if (!found)
      throw new NotFoundException(`AnimalOwner with ID ${id} not found`);
    return found;
  }

  async update(id: string, dto: UpdateAnimalOwnerDto): Promise<AnimalOwner> {
    const entity = await this.findOne(id);
    return await this.animalOwnerRepository.save({ ...entity, ...dto });
  }

  async remove(id: string): Promise<void> {
    const found = await this.findOne(id);
    await this.animalOwnerRepository.remove(found.id);
  }

  async removeAllOwnersFromAnimal(animalId: string): Promise<void> {
    const [owners] = await this.animalOwnerRepository.findMany({
      filter: { animalId: { eq: animalId } },
    });
    await Promise.all(
      owners.map((owner) => this.animalOwnerRepository.remove(owner.id)),
    );
  }
}
