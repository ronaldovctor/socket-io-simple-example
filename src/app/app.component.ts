import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatList, MatListItem } from '@angular/material/list';
import { Subscription } from 'rxjs';
import { Message } from './models/Message';
import { SocketIoService } from './services/socket-io.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';
  nickname?: string
  message?: string
  messages: Message[] = []
  private subscriptionMessages?: Subscription
  private subscriptionList?: Subscription

  @ViewChild(MatList, {read: ElementRef, static: true}) list!: ElementRef
  @ViewChildren(MatListItem) listItems!: QueryList<MatListItem>

  constructor(private socketService: SocketIoService){

  }

  ngOnInit(){
    this.subscriptionMessages = this.socketService.messages()
    .subscribe({
      next: (m: Message) => {
        console.log(m)
        this.messages.push(m)
      }
    })
  }

  ngAfterViewInit() {
    this.subscriptionList = this.listItems.changes
    .subscribe({
      next: (e) => this.list.nativeElement.scrollTop = this.list.nativeElement.scrollHeight
    })
  }

  ngOnDestroy() {
    this.subscriptionMessages?.unsubscribe()
    this.subscriptionList?.unsubscribe()
  }

  send() {
    this.socketService.send({
      from: this.nickname, 
      message: this.message
    } as Message)
    this.message = ''
  }
}
