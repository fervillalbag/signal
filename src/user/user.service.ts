import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userService: Model<User>,
  ) {}

  create(createUserDto: any) {
    return this.userService.create(createUserDto);
  }

  async get(id: string) {
    console.log(id);
    const user = await this.userService.findOne({ _id: id });
    return user;
  }
}
