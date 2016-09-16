import { NgModule, ChangeDetectorRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule, DomSanitizer } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
import { TranslateModule } from "ng2-translate/ng2-translate";

import { InstallComponent }  from "./install.component";

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        TranslateModule.forRoot()
    ],
    declarations: [
        InstallComponent
    ],
    bootstrap: [
        InstallComponent
    ],
    providers: [

    ]
})
export class AppInstallModule { }