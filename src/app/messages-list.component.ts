import { Component, Input, Output, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, Renderer, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { MessageViewModel, SingleMessageInfo, UserInfo, HistoryInfo } from "./datamodels/datamodels";
import { DialogService } from "./dialogs-service";
import { UserService } from "./user-service";
import { VKService } from "./vk-service";
import { Channels } from "../app.background/channels";
import { ChromeAPIService } from "./chrome-api-service";
import { DateConverter } from "./date-converter";

@Component({
    selector: "messages-list",
    templateUrl: "messages-list.component.html",
    styleUrls: [
        "messages-list.component.css"
    ]
})
export class MessagesListComponent implements OnInit, OnDestroy {
    @Input() is_chat: boolean;
    @Input() conversation_id: number;
    @Input() markAsRead: Observable<boolean>;
    @Input() historyUpdate: Observable<HistoryInfo>;

    participants: { [userId: number] : UserInfo } = {};
    user_id: number;
    history: SingleMessageInfo[] = [];
    messages_count: number;
    subscriptions: Subscription[] = [];
    history_to_show = [];

    constructor (
        private messages_service: DialogService,
        private vkservice: VKService,
        private user_service: UserService,
        private router: Router,
        private change_detector: ChangeDetectorRef,
        private chromeapi: ChromeAPIService,
        private renderer: Renderer) { }

    ngOnInit() {
        console.log("messages list component init");
        this.user_id = this.vkservice.getCurrentUserId();
        
        this.subscriptions.push(this.historyUpdate
            .subscribe(history => {
                this.history = history.messages;
                this.messages_count = history.count;
                this.history_to_show = this.getHistory(this.history);
                console.log("force update 1");
                this.refreshView();
            })
        );

        this.subscriptions.push(this.user_service.getUsers()
            .subscribe(users => {
                this.participants = users;
                this.history_to_show = this.getHistory(this.history);
                console.log("force update 2");
                this.refreshView();
            },
            error => this.errorHandler(error),
            () => console.log("finished users update")
        ));

        this.messages_service.subscribeOnMessagesCountUpdate(count => this.messages_count = count);

        this.subscriptions.push(this.markAsRead.subscribe(value => this.onMarkAsRead(value)));
    }

    ngOnDestroy() {
        console.log("messages list component destroy");
        for (let sub of this.subscriptions) {
            sub.unsubscribe();
        }
    }

    refreshView() {
        this.change_detector.detectChanges();
    }

    getHistory(messages: SingleMessageInfo[]): MessageViewModel[] {
        console.log("convert history: ", messages);
        if (!messages.length || !this.participants[messages[0].userId]) {
            console.log("not enough data: ", this.participants);
            return [];
        }
        let history: MessageViewModel[] = [];
        let mts = new MessageViewModel();
        let uid = messages[0].fromId;
        mts.from = this.participants[uid] || new UserInfo();
        mts.date = messages[0].date;
        mts.isUnread = !messages[0].isRead;

        for (let message of messages) {
            message.attachments = this.getMessageAttachments(message);
            if (message.fromId === uid
                && (mts.messages.length === 0
                    || (Math.abs(message.date - mts.messages[mts.messages.length - 1].date) < 60 * 5
                        && message.isRead === mts.messages[mts.messages.length - 1].isRead))) {
                    mts.messages.push(message);
            }
            else {
                history.push(mts);
                mts = new MessageViewModel();
                mts.from = this.participants[message.fromId] || new UserInfo();
                mts.messages.push(message);
                mts.date = message.date;
                uid = message.fromId;
            }
        }
        history.push(mts);
        console.log("history: ", history);
        return history;
    }

    getMessageAttachments(message: SingleMessageInfo) {
        console.log("get attachments");
        let attachments = [];
        if (message.attachments) {
            for (let attachment of message.attachments) {
                if (attachment.photo || attachment.doc ||
                        attachment.wall || attachment.link ||
                        attachment.video || attachment.sticker ||
                        attachment.audio) {
                    attachments.push(attachment);
                }
                else if (!attachment.fwd) {
                    attachments.push("[" + attachment.type + "]");
                }
            }
        }
        if (message.fwdMessages) {
            let attachment: any = {};
            attachment.type = "fwd";
            attachment.fwd = this.convertFwdMessages(message.fwdMessages);
            attachments.push(attachment);
            console.log("fwd: ", attachment);
        }
        return attachments;
    }

    convertFwdMessages(messages: SingleMessageInfo[]) {
        /** body, date, user_id, attachments */
        console.log("convert forwarded messages");
        let result: any[] = [];
        if (!messages || messages.length === 0) return [];
        let mts: any = {};
        mts.date = messages[0].date;
        mts.user = this.participants[messages[0].user_id] || new UserInfo();
        mts.user_id = messages[0].user_id;
        messages[0].attachments = this.getMessageAttachments(messages[0]);
        mts.messages = [messages[0]];
        for (let i = 1; i < messages.length; i++) {
            messages[i].attachments = this.getMessageAttachments(messages[i]);
            if (mts.user_id === messages[i].userId) {
                mts.messages.push(messages[i]);
            }
            else {
                result.push(mts);
                mts = {};
                mts.date = messages[i].date;
                mts.user = this.participants[messages[i].userId] || new UserInfo();
                mts.user_id = messages[0].userId;
                mts.messages = [messages[i]];
            }
        }
        result.push(mts);
        return result;
    }

    getUserName(uid: number): string {
        if (this.participants && this.participants[uid]) {
            return this.participants[uid].firstName;
        }
        return "loading...";
    }

    getUserPhoto(uid: number): string {
        if (this.participants && this.participants[uid] && this.participants[uid].photo50) {
            return this.participants[uid].photo50;
        }
        return "http://vk.com/images/camera_c.gif";
    }

    formatDate(unixtime: number): string {
        return DateConverter.formatDate(unixtime);
    }

    onMarkAsRead(value: boolean): void {
        if (!value) {
            return;
        }
        let ids = [];
        for (let m of this.history) {
            if (m.out || m.isRead) break;
            ids.push(m.id);
        }
        if (ids.length === 0) {
            console.log("unread messages was not found");
        }
        this.messages_service.markAsRead(ids.join()).subscribe(result => {
            if (result) {
                console.log("marked as read");
            }
            else {
                console.log("failed to mark messages as read");
            }
        });
    }

    loadOldMessages(): void {
        this.messages_service.loadOldMessages(this.conversation_id);
    }

    changePhotoSize(img: HTMLImageElement, photo: any): void {
        if (img.src === photo.photo_130) {
            img.src = photo.photo_604;
            img.classList.add("zoom_out");
            img.classList.remove("zoom_in");
        }
        else if (img.src === photo.photo_604) {
            img.src = photo.photo_130;
            img.classList.add("zoom_in");
            img.classList.remove("zoom_out");
        }
    }

    floor(x: number) {
        return Math.floor(x);
    }

    errorHandler(error): void {
        console.error("An error occurred", error);
    }
}