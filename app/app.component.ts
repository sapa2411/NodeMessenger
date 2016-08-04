import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Router } from '@angular/router';
import { Dialog } from './dialog'
import { Chat } from './dialog'
import { DialogComponent } from './dialog.component'
import { MessagesService } from './messages-service'

import { messagesFromNick, messagesFromSofy } from './mock-messages'

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html',
  directives: [DialogComponent, ROUTER_DIRECTIVES],
  providers: [MessagesService]
})
export class AppComponent { 
    title = "App";
}