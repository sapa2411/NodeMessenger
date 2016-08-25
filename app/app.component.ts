/// <reference path="../typings/globals/chrome/index.d.ts"/>
import { Component, ChangeDetectorRef } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Router } from '@angular/router';
import { Message } from './message'
import { Chat } from './message'
import { DialogComponent } from './dialog.component'
import { DialogsComponent } from './dialogs.component'
import { DialogService } from './dialogs-service'
import { UserService } from './user-service'
import { VKService } from './vk-service'

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [HTTP_PROVIDERS, UserService, VKService, DialogService, ChangeDetectorRef],
    precompile: [DialogsComponent, DialogComponent]
})
export class AppComponent { 
    title = "Dialogs";
}