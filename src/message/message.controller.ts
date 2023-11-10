import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Body() createMessageDto: any) {
    return this.messageService.create(createMessageDto);
  }

  @Get()
  getAll(@Query() query: { senderId: string; receiverId: string }) {
    return this.messageService.getAll(query.senderId, query.receiverId);
  }
}
