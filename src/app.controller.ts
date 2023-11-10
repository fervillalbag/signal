import { Body, Controller, Post } from '@nestjs/common';
import { PusherService } from './pusher/pusher.service';

@Controller()
export class AppController {
  constructor(private pusherService: PusherService) {}

  @Post()
  createMessage(
    @Body('username') username: string,
    @Body('message') message: string,
  ) {
    this.pusherService.trigger('chat', 'message', {
      username,
      message,
    });

    return [];
  }
}
