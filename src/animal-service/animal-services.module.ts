import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalServicesController } from './animal-services.controller';
import { AnimalServicesService } from './animal-services.service';
import { AnimalService } from './entities/animal-service.entity';
import { Animal } from '../animals/entities/animal.entity';
import { AnimalServiceAttachment } from './entities/animal-service-attachment.entity';
import { AttachmentsModule } from 'src/attachments/attachments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnimalService, Animal, AnimalServiceAttachment]),
    AttachmentsModule,
  ],
  controllers: [AnimalServicesController],
  providers: [AnimalServicesService],
})
export class AnimalServicesModule {}
