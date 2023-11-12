import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userService: Model<User>,
    private jwtService: JwtService,
  ) {}

  create(createUserDto: any) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(createUserDto.password, salt);

    return this.userService.create({
      ...createUserDto,
      password: hash,
    });
  }

  async login(loginUserDto: {
    email: string;
    password: string;
  }): Promise<{ access_token: string } | any> {
    try {
      if (!loginUserDto.email || !loginUserDto.password) {
        return new NotFoundException(
          'Los campos email y password son requeridos',
        );
      }

      const emailExists = await this.userService.findOne({
        email: loginUserDto.email,
      });
      if (!emailExists) {
        return new NotFoundException('Credenciales incorrecta');
      }

      const isPasswordCorrect = bcrypt.compareSync(
        emailExists.password,
        loginUserDto.password,
      );
      if (isPasswordCorrect) {
        return new NotFoundException('Credenciales incorrecta');
      }

      const payload = {
        id: emailExists?._id,
        email: emailExists?.email,
        name: emailExists?.name,
      };

      return {
        access_token: await this.jwtService.signAsync(payload, {
          secret: 'secretKei2!',
          expiresIn: '60d',
        }),
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getAll() {
    const users = await this.userService.find();
    return users;
  }

  async get(id: string) {
    const user = await this.userService.findOne({ _id: id });
    return user;
  }
}
