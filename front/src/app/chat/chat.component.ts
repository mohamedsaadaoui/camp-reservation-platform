import { Component } from '@angular/core';
import { MessageService } from '../message.service';
import { Message } from '../models/Message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  isChatExpanded = true;
  messageCount: number = 0;
maxMessagesToShow: number = 5; // Number of messages before scrolling

  title = 'websocket-frontend';
  message: Message = {
    senderName: localStorage.getItem('chat-username') || 'dorra', // Get from local storage or use a default
    status: 'MESSAGE',
    media: '',
    message: '', // Leave it empty to get user input from HTML
  };

  input: any;
  constructor(public messageService: MessageService) {}
  sendMessage() {
    if (this.message.message) {
      this.messageCount++;
      this.messageService.sendMessage(this.message);
      console.log(this.messageService.messages);
      // Clear the message field or set it to your desired default value
      this.message.message = '';
    }
  }


  toggleChat() {
    this.isChatExpanded = !this.isChatExpanded;
  }


}
