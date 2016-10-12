import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, Renderer, EventEmitter } from "@angular/core";
import { trigger, state, transition, style, animate, keyframes } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { DialogService } from "./dialogs-service";
import { UserService } from "./user-service";
import { VKService } from "./vk-service";
import { Channels } from "../app.background/channels";
import { ChromeAPIService } from "./chrome-api-service";
import { FileUploadService } from "./file-upload.service";
import { OptionsService } from "./services";
import { SingleMessageInfo, HistoryInfo } from "./datamodels/datamodels";
import { MenuItem } from "./menu-item";

@Component({
    selector: "messages",
    templateUrl: "dialog.component.html",
    styleUrls: [
        "css/round-buttons.css",
        "css/color-scheme.css",
        "app.component.css",
        "dialog.component.css",
    ],
    animations: [
        trigger('flyInOut', [
            state('in', style({transform: 'translateX(0) scale(1)'})),
            state('out', style({transform: 'translateX(0) scale(0)', opacity: 0, display: 'none'})),
            transition('out => in', [
                animate(200, keyframes([
                    style({opacity: 0, transform: 'translateX(0) scale(0)', offset: 0}),
                    style({opacity: 1, transform: 'translateX(0) scale(1.1)', offset: 0.3}),
                    style({opacity: 1, transform: 'translateX(0) scale(1)', offset: 1.0})
                ]))
            ]),
            transition('in => out', [
                animate(100, style({transform: 'translateX(0) scale(0)'}))
            ]),
            transition('void => *', [
                animate(0, style({transform: 'translateX(0) scale(0)', opacity: 0, display: 'none'}))
            ])
        ])
    ]
})
export class DialogComponent implements OnInit, OnDestroy {
    @ViewChild("conversationsWrapper") messagesList: ElementRef;
    isBeta: boolean = false;

    title = "Dialog";
    is_chat: boolean;
    conversation_id: number;
    attachments_uploading_count: number = 0;
    attachments: MenuItem[] = [];

    attachmentUploaded: EventEmitter<boolean> = new EventEmitter();
    selectEmoji: EventEmitter<string> = new EventEmitter();
    onEmojiToggle: EventEmitter<boolean> = new EventEmitter();
    markAsRead: EventEmitter<boolean> = new EventEmitter();
    historyUpdate: EventEmitter<HistoryInfo> = new EventEmitter();
    onSendMessageClick: EventEmitter<{}> = new EventEmitter();
    newAttachment: EventEmitter<MenuItem> = new EventEmitter();
    removeAttachment: EventEmitter<string> = new EventEmitter();

    unreadMessages: string = "out";
    autoReadMessages: boolean = true;
    scrollToBottomAvailable: string = "out";
    sendEnabled: boolean = true;
    isAttachedFilesOpened: boolean = false;
    attachedFiles: any[];

    topPanel: string = "calc(100% - 130px - 45px)";
    bottomPanel: string = "calc(100% - 130px)";
    emojiPanel: string = "130px";

    scrollPosition: number = 1000000;
    scrollHeight: number = 1000000;
    autoScrollToBottom: boolean = true;

    subscriptions: Subscription[] = []

    constructor (
        private messages_service: DialogService,
        private vkservice: VKService,
        private user_service: UserService,
        private router: Router,
        private route: ActivatedRoute,
        private change_detector: ChangeDetectorRef,
        private chromeapi: ChromeAPIService,
        private fileUpload: FileUploadService,
        private renderer: Renderer,
        private settings: OptionsService) { }

    ngOnInit() {
        console.log("specific dialog component init");
        this.route.params.subscribe(params => {
            this.title = params["title"];
            this.conversation_id = +params["id"];
            let type = params["type"];
            this.is_chat = type === "dialog" ? false : true;

            this.chromeapi.SendMessage({
                name: "last_opened",
                last_opened: {
                    id: this.conversation_id,
                    title: this.title,
                    type: this.is_chat ? "chat" : "dialog"
                }
            });

            this.subscriptions.push(this.messages_service.getHistory(this.conversation_id, this.is_chat).subscribe(data => {
                console.log("got history update", data);
                let historyInfo = new HistoryInfo();
                historyInfo.messages = data.history;
                historyInfo.count = data.count;
                this.historyUpdate.emit(historyInfo);
                if (!this.autoReadMessages) {
                    this.unreadMessages = (historyInfo.messages.findIndex(m => !m.isRead && !m.out) > -1) ? "in" : "out";
                    this.change_detector.detectChanges();
                }
                else {
                    this.onMarkAsRead();
                }
                if (this.autoScrollToBottom) {
                    this.scrollToBottom();
                }
                else {
                    this.scrollHeight += 1000000;
                }
            }));
        });

        this.subscriptions.push(
            this.settings.activatePreviewFeatures.subscribe(value => {
                this.isBeta = value;
            })
        );

        this.subscriptions.push(
            this.settings.autoReadMessages.subscribe(value => {
                this.autoReadMessages = value;
            })
        );
    }

    ngAfterViewInit() {
        console.log("after view init");
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        this.autoScrollToBottom = true;
        this.scroll(this.scrollHeight);
        setTimeout(() => this.scrollToBottomAvailable = "out", 100);
    }

    scroll(height: number): void {
        this.renderer.setElementProperty(this.messagesList.nativeElement, "scrollTop", height);
    }

    messageSent(value: boolean): void {
        this.sendEnabled = value;
    }

    startResize(divs: HTMLDivElement[], event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        for (let div of divs) {
            div.onmousemove = (event) => this.resize(event);
        }
    }

    stopResize(divs: HTMLDivElement[], event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        for (let div of divs) {
            div.onmousemove = undefined;
        }
    }

    resize(e: MouseEvent) {
        e.preventDefault();
        let y = Math.max(150, e.pageY);
        this.topPanel = `${y - 65}px`;
        this.bottomPanel = `${y - 20}px`;
        this.emojiPanel = `calc(100% - ${y - 20}px)`;
    }

    ngOnDestroy() {
        console.log("specific dialog component destroy");
        this.chromeapi.SendMessage({
            name: "last_opened",
            last_opened: null,
            go_back: true
        });
        for (let s of this.subscriptions) {
            s.unsubscribe();
        }
    }

    onMarkAsRead() {
        this.markAsRead.emit(true);
        this.unreadMessages = "out";
        this.change_detector.detectChanges();
    }

    onScroll(current: number, max: number) {
        this.scrollPosition = current;
        this.scrollHeight = max;
        this.autoScrollToBottom = max - current < 400;
        this.scrollToBottomAvailable = max - current < 400 ? "out" : "in";
    }

    onEmojiSelect(event): void {
        console.info("on emoji select", event);
        this.selectEmoji.emit(event);
    }

    errorHandler(error) {
        console.error("An error occurred", error);
    }

    toggleEmoji() {
        this.onEmojiToggle.emit(true);
    }

    uploadFiles(event): void {
        if (!event.target.files.length) {
            console.log("nothing to upload");
            return;
        }
        this.attachmentUploaded.emit(false);
        this.change_detector.detectChanges();
        for (let i = 0; i < event.target.files.length; i++) {
            this.uploadFile(event.target.files.item(i));
        }
    }

    uploadFile(file: File) {
        this.attachments_uploading_count++;
        let fileName = file.name;
        this.fileUpload.uploadFile(file).subscribe(att => {
            console.log("attachment is ready to send", att);
            this.attachments_uploading_count--;
            if (!this.attachments_uploading_count) {
                this.attachmentUploaded.emit(true);
            }
            this.newAttachment.emit({ name: fileName, id: att, termId: "" });
            this.change_detector.detectChanges();
        });
    }

    onAttachmentsUpdate(attachments: MenuItem[]): void {
        console.log("update attachments", this.attachments, attachments);
        this.attachments = attachments;
        this.change_detector.detectChanges();
    }

    onAttachedFileRemove(fileId: string): void {
        console.log("removing", fileId);
        this.removeAttachment.emit(fileId);
    }

    showAttachments(): void {
        this.isAttachedFilesOpened = this.attachments.length > 0;
    }

    hideAttachments(): void {
        this.isAttachedFilesOpened = false
    }

    uploadFilesFromClipboard(event: ClipboardEvent) {
        // TODO: improve or remove
        return;
        /* let files: File[] = [];
        if (event.clipboardData.files.length) {
            for (let i = 0; i < event.clipboardData.files.length; i++) {
                this.uploadFile(event.clipboardData.files.item(i));
            }
        }
        else {
            for(let i = 0; i < event.clipboardData.items.length; i++) {
                let item = event.clipboardData.items[i];
                console.log("clipboard item", item.kind, item.type);
                if (item.kind === "file" && item.type.startsWith("image")) {
                    this.uploadFile(item.getAsFile());
                }
            }
        }*/
    }
}