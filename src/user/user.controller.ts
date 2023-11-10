import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: any) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.userService.get(id);
  }
}
