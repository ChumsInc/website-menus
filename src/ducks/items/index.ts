import {MenuItem} from "b2b-types";
import {createReducer} from "@reduxjs/toolkit";
import {loadMenu, setNewMenu} from "../menu/actions";
import {loadMenuItem, removeMenuItem, saveMenuItem} from "../item/actions";
import {saveItemSort} from "./actions";
import {prioritySort, sortOrderKey} from "./utils";

export interface ItemsState {
    list: MenuItem[];
    status: 'idle' | 'saving' | 'saving-sort' | 'deleting' | 'loading';
    currentSort: string;
}

export const initialState: ItemsState = {
    list: [],
    status: 'idle',
    currentSort: '',
}


const itemsReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(loadMenu.fulfilled, (state, action) => {
            state.list = [...(action.payload?.items ?? [])].sort(prioritySort);
            state.currentSort = sortOrderKey(state.list);
        })
        .addCase(saveItemSort.pending, (state) => {
            state.status = 'saving-sort';
        })
        .addCase(saveItemSort.fulfilled, (state, action) => {
            state.status = 'idle';
            state.list = [...action.payload].sort(prioritySort);
            state.currentSort = sortOrderKey(state.list);
        })
        .addCase(saveItemSort.rejected, (state) => {
            state.status = 'idle';
        })
        .addCase(saveMenuItem.fulfilled, (state, action) => {
            if (action.payload) {
                state.list = [
                    ...state.list.filter(item => item.id !== action.payload?.id),
                    action.payload,
                ].sort(prioritySort);
                state.currentSort = sortOrderKey(state.list);
            }
        })
        .addCase(loadMenuItem.fulfilled, (state, action) => {
            if (action.payload) {
                state.list = [
                    ...state.list.filter(item => item.id !== action.payload?.id),
                    action.payload,
                ].sort(prioritySort);
                state.currentSort = sortOrderKey(state.list);
            }
        })
        .addCase(removeMenuItem.fulfilled, (state, action) => {
            state.list = [...action.payload].sort(prioritySort);
            state.currentSort = sortOrderKey(state.list);
        })
        .addCase(setNewMenu, (state) => {
            state.list = [];
            state.currentSort = sortOrderKey(state.list);
        })
});

export default itemsReducer;
