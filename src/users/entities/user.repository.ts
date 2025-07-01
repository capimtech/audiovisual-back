import { Injectable } from '@nestjs/common';
import { BaseRepositoryAdapter } from 'src/common/baseRepository';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository extends BaseRepositoryAdapter<User> {
  constructor(
    @InjectRepository(User)
    private readonly _: Repository<User>,
  ) {
    super(_);
  }
}
