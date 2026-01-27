import { Injectable } from '@angular/core';
declare var SockJS: any;
declare var Stomp: any;

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private stompClient: any;
  public messages: any[] = [];

  constructor() {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    const serverUrl = 'http://localhost:8082/chatroom/ws';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;

    this.stompClient.connect({}, function (frame: any) {
      that.stompClient.subscribe('/chatroom/public', (message: any) => {
        if (message.body) {
          console.log(message.body);
          that.messages.push(JSON.parse(message.body));
        }
      });
    });
  }

  sendMessage(message: any) {
    this.stompClient.send('/app/message', {}, JSON.stringify(message));
  }
}
