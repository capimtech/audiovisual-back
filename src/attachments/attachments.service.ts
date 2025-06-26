import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { v4 as uuidV4 } from 'uuid';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { TenantService } from '../tenant/tenant.service';
import { AttachmentRepository } from './entities/attachment.repository';
import { ObjectStorageAdapter } from './entities/objectStorage.adapter';

@Injectable()
export class AttachmentsService {
  constructor(
    @Inject(ObjectStorageAdapter)
    private readonly objectStorageAdapter: ObjectStorageAdapter,
    @Inject(AttachmentRepository)
    private readonly attachmentRepositoryAdapter: AttachmentRepository,
    private readonly tenantService: TenantService,
  ) {}

  async create(
    activeUser: ActiveUserData,
    filename: string,
    buffer?: Buffer,
    contentType?: string,
  ) {
    const key = `${uuidV4()}-${filename}`;

    const attachment = await this.attachmentRepositoryAdapter.create({
      key,
      companyId: activeUser?.companyId,
    });

    const presignedPutUrl =
      await this.objectStorageAdapter.generatePresignedPutUrl(
        key,
        48 * 3600,
        'public-read',
        contentType,
      );

    if (buffer)
      await this.objectStorageAdapter.uploadBuffer(key, buffer, contentType);

    return { attachment, presignedPutUrl };
  }

  async findOne(id: string, contentType?: string, activeUser?: ActiveUserData) {
    const attachment = await this.attachmentRepositoryAdapter.rawFindOne({
      where: { id, companyId: activeUser?.companyId || undefined },
    });

    if (!attachment) throw new NotFoundException('Arquivo não encontrado.');

    const presignedGetUrl =
      await this.objectStorageAdapter.generatePresignedGetUrl(
        attachment.key,
        7 * 24 * 3600,
        contentType,
      );

    return { attachment, presignedGetUrl };
  }

  async delete(
    id: string,
    // activeUser: ActiveUserData
  ) {
    const company = this.tenantService.getTenant();

    const attachment = await this.attachmentRepositoryAdapter.rawFindOne({
      where: { id, companyId: company.id },
    });

    if (!attachment) throw new NotFoundException('Arquivo não encontrado.');

    await this.objectStorageAdapter.deleteObject(attachment?.key);

    await this.attachmentRepositoryAdapter.remove(id);

    return;
  }

  async uploadAttachment(buffer: Buffer, filename: string) {
    const key = `${uuidV4()}-${filename}`;

    await this.objectStorageAdapter.generatePresignedPutUrl(key);
    await this.objectStorageAdapter.uploadBuffer(key, buffer);
    const url = await this.objectStorageAdapter.generatePresignedGetUrl(key);

    return url;
  }
}
