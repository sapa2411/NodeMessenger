import { DialogListInfo, UserListInfo, ChatListInfo, HistoryListInfo } from "./datamodels";
import { dialogListReducer, usersReducer, chatsReducer, historyReducer } from "./reducers";

export const appBackgroundStore = {
    users: usersReducer,
    dialogs: dialogListReducer,
    chats: chatsReducer,
    history: historyReducer
};

export interface AppBackgroundStore {
    users: UserListInfo;
    dialogs: DialogListInfo;
    chats: ChatListInfo;
    history: HistoryListInfo;
}

export const INITIAL_APP_STATE = {
    users: new UserListInfo(),
    dialogs: new DialogListInfo(),
    chats: new ChatListInfo(),
    history: new HistoryListInfo()
};

export { DialogListActions, UsersActions, ChatsActions, HistoryActions } from "./reducers";