import { NgModule, ChangeDetectorRef }      from "@angular/core";
import { FormsModule }      from "@angular/forms";
import { BrowserModule, DomSanitizer } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
import { TranslateModule } from "ng2-translate/ng2-translate";

import { AppComponent }  from "./app.component";
import { DialogsComponent }  from "./dialogs.component";
import { DialogComponent }  from "./dialog.component";
import { LoginComponent }  from "./login.component";
import { routing } from "./app.routing";

import { DialogService } from "./dialogs-service";
import { UserService } from "./user-service";
import { VKService } from "./vk-service";
import { MessageAttachmentIconPipe, MessageAttachmentSubTitlePipe, MessageAttachmentTitlePipe, MessageAttachmentUrlPipe, ChatActionPipe, SafePipe } from "./attachment.pipe";

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        routing,
        TranslateModule.forRoot()
    ],
    declarations: [
        AppComponent,
        DialogComponent,
        DialogsComponent,
        LoginComponent,
        MessageAttachmentIconPipe,
        MessageAttachmentSubTitlePipe,
        MessageAttachmentTitlePipe,
        MessageAttachmentUrlPipe,
        ChatActionPipe,
        SafePipe
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        UserService,
        VKService,
        DialogService
    ]
})
export class AppModule { }