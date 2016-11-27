import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { bootloader } from "@angularclass/hmr";
import { enableProdMode } from "@angular/core";
/*
 * App Module
 * our top level module that holds all of our components
 */
import { AppModule } from "./app.demo.module";

localStorage.setItem("vk_session_info", `{"accessToken":"ewlrjwqklrwq","tokenExp":0,"userId":1,"timestamp":1480213200}`);
localStorage.setItem("settings", `{"activatePreviewFeatures":false,"autoReadMessages":true,"currentLang":"ru","setOnline":false,"showTyping":false,"stickerSize":"large","windowSize":"small"}`);

/*
 * Bootstrap our Angular app with a top level NgModule
 */
export function main(): Promise<any> {
  enableProdMode();
  return platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
}

// needed for hmr
// in prod this is replace for document ready
bootloader(main);