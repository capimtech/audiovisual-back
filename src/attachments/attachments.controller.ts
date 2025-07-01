import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TenantInterceptor } from 'src/tenant/tenant.interceptor';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@UseInterceptors(TenantInterceptor)
@ApiTags('attachments')
@Controller('attachments')
export class AttachmentsController {
  constructor(
    @Inject(AttachmentsService)
    private readonly attachmentsService: AttachmentsService,
  ) {}

  @Post()
  @ApiOperation({ description: 'Create attachment' })
  async create(
    @Body() createAttachmentDto: CreateAttachmentDto,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    return this.attachmentsService.create(
      activeUser,
      createAttachmentDto.filename,
    );
  }

  @Get(':id')
  @ApiOperation({ description: 'Get attachment' })
  async findOne(
    @Param('id') id: string,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    return await this.attachmentsService.findOne(id, undefined, activeUser);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete attachment' })
  async delete(
    @Param('id') id: string,
    // @ActiveUser() activeUser: ActiveUserData,
  ) {
    return await this.attachmentsService.delete(
      id,
      // activeUser
    );
  }
}
