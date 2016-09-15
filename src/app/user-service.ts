import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { Channels } from "../app.background/channels";

import { User } from "./user";
import { VKService } from "./vk-service";
import { ChromeAPIService } from "./chrome-api-service";
import { SessionInfo } from "./session-info";

@Injectable()
export class UserService {
    constructor(private vkservice: VKService, private chromeapi: ChromeAPIService) { }

    getUser(uid: number = null): Observable<User> {
        console.log("one user requested");
        return this.chromeapi.SendRequest({
            name: Channels.get_user_request,
            user_id: uid
        }).map(x => x.data);
    }

    getUsers() {
        let o = this.chromeapi.subscribeOnMessage("users_update").map(x => x.data);
        this.chromeapi.PostPortMessage({
            name: "get_users",
        });
        return o
    }
}