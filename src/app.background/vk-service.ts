import { Injectable, EventEmitter } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http } from "@angular/http";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/concatMap";
import "rxjs/add/operator/retry";
import "rxjs/add/operator/take";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/retryWhen";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/of";

import { VKConsts } from "../app/vk-consts";
import { SessionInfo } from "./datamodels/datamodels";
import { ErrorHelper } from "./error-helper";
import { AuthHelper } from "./auth-helper";

@Injectable()
export class VKService {
    onLogOff: EventEmitter<{}> = new EventEmitter();
    private session_info: SessionInfo;
    private authorized: boolean = false;
    private set_online = "account.setOnline";

    private handleError(error: any) {
        console.error("An error occurred", error);
    }

    constructor(private http: Http) {
        this.initializeSeesion();
    }

    auth(force: boolean = false): Observable<SessionInfo> {
        console.log("authorization requested");
        if (!this.isSessionValid()) {
            let obs = AuthHelper.authorize(force);
            obs.catch(error => {
                console.error("failed to authorize: ", error);
                return Observable.of(null);
            }).subscribe(session => {
                    if (session) {
                        console.log("authorization successful");
                        this.session_info = session;
                        this.authorized = true;
                    }
                },
                error => {
                    console.error("authorization failed: ", error)
                }
            );
            return obs;
        }
        else {
            this.authorized = true;
            return Observable.of(this.session_info);
        }
    }

    initializeSeesion(): void {
        this.session_info = JSON.parse(window.localStorage.getItem(VKConsts.vk_session_info));
    }

    isAuthorized(): boolean {
        return this.authorized && this.isSessionValid();
    }

    isSessionValid(): boolean {
        this.initializeSeesion();
        return Boolean(
            this.session_info
            && this.session_info.access_token
            && this.session_info.timestamp
            && this.session_info.user_id
            && (this.session_info.token_exp === 0 || Math.floor(Date.now() / 1000) - this.session_info.timestamp < this.session_info.token_exp)
        );
    }

    getSession(): Observable<SessionInfo> {
        if (!this.isSessionValid()) {
            return this.auth();
        }
        return Observable.of(this.session_info);
    }

    logoff(): void {
        this.session_info = null;
        window.localStorage.removeItem(VKConsts.vk_session_info);
        this.onLogOff.emit();
    }

    setOnline(): void {
        this.getSession().concatMap(session => {
            console.log("set online, got session: ", session);
            let uri: string = VKConsts.api_url + this.set_online
                + "?access_token=" + session.access_token
                + "&v=" + VKConsts.api_version;

            return this.http.get(uri).map(response => response.json()).map(json => ErrorHelper.checkErrors(json) ? null : json.response);
            /** response: {count: number, items: Message[]} */
        }).subscribe((result => {
            if (result === 1) {
                console.log("user online");
            }
            else {
                console.log("filed to set online");
            }
        },
        error => console.error("Error occured while setting online: ", error),
        () => console.log("set online reqest completed")));
    }

    performAPIRequest(method: string, parameters: string): Observable<any> {
        return this.getSession().concatMap(session => {
            if (!session) {
                console.log("session is null, not authorized");
                this.authorized = false;
                return Observable.throw({
                    type: "Unauthorized",
                    message: "Unable to get session"
                });
            }
            let url = `${VKConsts.api_url}${method}?access_token=${session.access_token}&v=${VKConsts.api_version}`;
            if (parameters) {
                url += "&" + parameters;
            }
            console.log(`perform api request to url ${url}`);
            return this.http.get(url)
                .map(response => response.json())
                .map(json => ErrorHelper.checkErrors(json) ? {} : (json.response ? json.response : Observable.throw(json)))
                .retryWhen(error => {
                    console.warn("failed http request: ", error)
                    return error.delay(500);
                })
                .take(10);
        })
        .retryWhen(error => {
            console.warn("failed api request: ", error)
            return error.delay(500);
        })
        .take(10)
        .catch(error => {
            console.error(`An error occured during api request ${method} with parameters ${parameters}:`, error);
            return Observable.of({});
        });
    }

    getCurrentUserId(): number {
        return this.session_info.user_id;
    }
}