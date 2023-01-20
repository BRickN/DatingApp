import { MessageService } from './../_services/message.service';
import { Pagination } from './../_models/pagination';
import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  pagination: Pagination;
  container = "Unread";
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(r => {
      this.messages = r.result;
      this.pagination = r.pagination
      this.loading = false;
    })
  }

  pageChanged(e: any) {
    if (this.pageNumber !== e.page) {
      this.pageNumber = e.page;
      this.loadMessages();
    }
  }

  deleteMessage(messageId: number) {
    this.messageService.deleteMessage(messageId).subscribe(() => {
      this.messages.splice(this.messages.findIndex(m => m.id === messageId), 1);
    });
  }

}
