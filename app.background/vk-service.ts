/// <reference path="../typings/globals/chrome/index.d.ts"/>
import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

import { VKConsts } from '../app/vk-consts';
import { SessionInfo } from '../app/session-info';

import { AuthHelper } from './auth-helper';

@Injectable()
export class VKService {
    private session_info: SessionInfo;

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    constructor() {
        this.initializeSeesion();
    }

    auth(force: boolean = false) {
        console.log('authorization requested');
        this.initializeSeesion();
        if (!this.isSessionValid()) {
            let force = this.session_info ? false : true;
            AuthHelper.authorize(force);
        }
    }

    initializeSeesion() {
        this.session_info = eval('('+window.localStorage.getItem(VKConsts.vk_session_info)+')');
    }

    isSessionValid() {
        this.initializeSeesion();
        return Boolean(
            this.session_info 
            && this.session_info.access_token 
            && this.session_info.timestamp
            && this.session_info.token_exp
            && this.session_info.user_id
            && !this.session_info.isExpired
        );
    }

    getSession(): SessionInfo {
        if (!this.isSessionValid()) {
            let background: boolean = this.session_info ? this.session_info.isExpired() : false;            
            this.auth(background);  
        }
        return this.session_info;
    }
}

// https://oauth.vk.com/authorize?client_id=5573653&scope=messages&redirect_uri=https://oauth.vk.com/blank.html&display=page&response_type=token&v=5.53