import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Message } from './entities/message.entity';
import { PusherService } from 'src/pusher/pusher.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageService: Model<Message>,
    private pusherService: PusherService,
  ) {}

  async create(createMessageDto: any) {
    const message = await this.messageService.create(createMessageDto);
    this.pusherService.trigger('chat', 'message', message);
    return message;
  }

  getAll(senderId: string, receiverId: string) {
    return this.messageService
      .find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { receiver: senderId, sender: receiverId },
        ],
      })
      .populate('sender');
  }
}
