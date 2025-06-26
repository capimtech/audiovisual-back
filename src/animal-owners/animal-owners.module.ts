import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalOwnersService } from './animal-owners.service';
import { AnimalOwnersController } from './animal-owners.controller';
import { AnimalOwner } from './entities/animal-owner.entity';
import { AnimalOwnerRepository } from './entities/animal-owner.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AnimalOwner])],
  controllers: [AnimalOwnersController],
  providers: [AnimalOwnersService, AnimalOwnerRepository],
  exports: [AnimalOwnersService],
})
export class AnimalOwnersModule {}
