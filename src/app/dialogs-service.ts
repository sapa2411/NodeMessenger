import { Injectable } from "@angular/core";
import { Http, Response, RequestOptionsArgs } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { VKService } from "./vk-service";
import { Message, Chat } from "./message";
import { Dialog } from "./dialog";
import { User } from "./user";
import { Channels } from "../app.background/channels";
import { ChromeAPIService } from "./chrome-api-service";

@Injectable()
export class DialogService {
    chat_observable: Observable<{}>;
    dialogs_observable: Observable<{}>;

    private chats;

    constructor(
        private http: Http,
        private vkservice: VKService,
        private chromeapi: ChromeAPIService) { }

    init() {
        this.initChatsUpdate();
        this.initDialogsUpdate();
    }

    markAsRead(ids: string): Observable<number> {
        console.log("requested message(s) with id: " + ids);
        return this.chromeapi.SendRequest({
            name: Channels.mark_as_read_request,
            message_ids: ids
        }).map(x => x.data);
    }

    sendMessage(id: number, message: string, chat: boolean): Observable<Message> {
        console.log("sending message");
        return this.chromeapi.SendRequest({
            name: Channels.send_message_request,
            user_id: id,
            message_body: message,
            is_chat: chat
        }).map(x => x.data);
    }

    loadOldDialogs() {
        this.chromeapi.PostPortMessage({
            name: Channels.load_old_dialogs_request
        });
    }

    loadOldMessages(conversation_id) {
        this.chromeapi.SendMessage({
            name: Channels.load_old_messages_request,
            id: conversation_id
        });
    }

    subscribeOnDialogsCountUpdate(callback: (dialogsCount: number) => void) {
        this.chromeapi.OnPortMessage(Channels.dialogs_count_update).subscribe((message: any) => {
            console.log("got dialogs_count_update message");
            callback(message.data);
        });
    }

    subscribeOnMessagesCountUpdate(callback: (messagesCount: number) => void) {
        this.chromeapi.OnPortMessage(Channels.messages_count_update).subscribe((message: any) => {
            console.log("got messages_count_update message");
            callback(message.data);
        });
    }

    initChatsUpdate(): void {
        this.chat_observable = this.chromeapi.subscribeOnMessage(Channels.update_chats).map(x => x.data);
    }

    initDialogsUpdate(): void {
        this.dialogs_observable = this.chromeapi.subscribeOnMessage("dialogs_update").map(x => x.data);
    }

    getHistory(conversation_id, is_chat) {
        let o = this.chromeapi.subscribeOnMessage("history_update" + conversation_id).map(x => x.data);
        this.chromeapi.SendMessage({
            name: "conversation_id",
            id: conversation_id,
            is_chat: is_chat
        });
        return o;
    }
}