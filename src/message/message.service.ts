import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Message } from './entities/message.entity';
import { PusherService } from '../pusher/pusher.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageService: Model<Message>,
    private readonly pusherService: PusherService,
  ) {}

  async create(createMessageDto: any) {
    const message = await this.messageService.create(createMessageDto);
    this.pusherService.trigger('testing-chat', 'testing-message', message);
    return message;
  }

  getAll(user1: string, user2?: string) {
    if (!user2) {
      return this.messageService
        .find({
          $or: [{ sender: user1 }, { receiver: user1 }],
        })
        .populate('sender receiver');
    }

    return this.messageService
      .find({
        $or: [
          { sender: user1, receiver: user2 },
          { receiver: user1, sender: user2 },
        ],
      })
      .populate('sender receiver');
  }
}
