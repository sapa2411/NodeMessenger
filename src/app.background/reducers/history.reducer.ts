import { ActionReducer, Action } from "@ngrx/Store";

import { HistoryListInfo, HistoryInfo } from "../datamodels";

export class HistoryActions {
    static HISTORY_LOADED = "HISTORY_LOADED";
    static HISTORY_UPDATED = "HISTORY_UPDATED";
}

export const historyReducer: ActionReducer<HistoryListInfo> = (state: HistoryListInfo, action: Action): HistoryListInfo => {
    switch (action.type) {
        case HistoryActions.HISTORY_LOADED:
            let newHistory = new HistoryListInfo();
            newHistory.conversationIds.push(action.payload.conversationId);
            newHistory.history[action.payload.conversationId] = action.payload;
            return newHistory;
        case HistoryActions.HISTORY_UPDATED:
            let updatedHistory = Object.assign(new HistoryListInfo(), state);
            let id = action.payload.conversationId;
            if (!updatedHistory.history[id]) {
                updatedHistory.conversationIds.push(id);
                updatedHistory.history[id] = action.payload;
            }
            else {
                updatedHistory.history[id] = mergeHistory(state.history[id], action.payload);
            }

            return updatedHistory;
        default:
            return state;
    };
};

function mergeHistory(history1: HistoryInfo, history2: HistoryInfo): HistoryInfo {
    let result = Object.assign(new HistoryInfo(), history1);
    let newIdHead = history2.messages[0].id;
    let newIdTail = history2.messages[history2.messages.length - 1].id;

    let oldHead = history1.messages.findIndex(x => x.id === newIdHead);
    let oldTail = history1.messages.findIndex(x => x.id === newIdTail);

    if (oldHead === -1 && oldTail === -1) {
        result.messages = history2.messages;
    } else if (oldHead > -1 && oldTail > -1) {
        result.messages = history1.messages.slice(0, oldHead).concat(history2.messages).concat(history1.messages.slice(oldTail + 1));
    } else if (oldHead > -1) {
        result.messages = history1.messages.slice(0, oldHead).concat(history2.messages);
    } else { // if (oldTail > -1)
        result.messages = history2.messages.concat(history1.messages.slice(oldTail + 1));
    }
    return result;
}