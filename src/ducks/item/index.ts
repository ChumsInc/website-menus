import {MenuItem} from "b2b-types";
import {Editable} from "b2b-types/src/generic";
import {createReducer} from "@reduxjs/toolkit";
import {loadMenuItem, removeMenuItem, saveMenuItem, setCurrentMenuItem, updateMenuItem} from "./actions";
import {loadMenu, saveMenu, setNewMenu} from "../menu/actions";

export interface MenuItemState {
    current: (MenuItem & Editable) | null;
    actionStatus: 'idle' | 'loading' | 'saving' | 'deleting';
}

const initialState: MenuItemState = {
    current: null,
    actionStatus: 'idle',
}

export const defaultMenuItem:MenuItem = {
    id: 0,
    title: '',
    description: '',
    menuId: 0,
    status: 1,
    parentId: 0,
    className: '',
    url: '',
    priority: 0,
}


const menuItemReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setCurrentMenuItem, (state, action) => {
            state.current = action.payload;
        })
        .addCase(updateMenuItem, (state, action) => {
            if (state.current) {
                state.current = {...state.current, ...action.payload, changed: true};
            }
        })
        .addCase(loadMenuItem.pending, (state, action) => {
            state.actionStatus = 'loading'
            if (state.current && state.current.id !== action.meta.arg.id) {
                state.current = null;
            }
        })
        .addCase(loadMenuItem.fulfilled, (state, action) => {
            state.actionStatus = 'idle';
            state.current = action.payload;
        })
        .addCase(loadMenuItem.rejected, (state) => {
            state.actionStatus = 'idle';
        })
        .addCase(loadMenu.pending, (state, action) => {
            if (state.current && action.meta.arg !== state.current.parentId) {
                state.current = null;
            }
        })
        .addCase(loadMenu.fulfilled, (state, action) => {
            if (action.payload) {
                if (!state.current || state.current.parentId !== action.payload.id) {
                    state.current = {...defaultMenuItem, parentId: action.payload?.id}
                } else {
                    const [item] = action.payload?.items?.filter(item => item.id === state.current?.id) ?? [];
                    state.current = item ?? {...defaultMenuItem, parentId: action.payload.id};
                }
            } else {
                state.current = null;
            }

        })
        .addCase(saveMenuItem.pending, (state) => {
            state.actionStatus = 'saving';
        })
        .addCase(saveMenuItem.fulfilled, (state, action) => {
            state.actionStatus = 'idle';
            state.current = action.payload;
        })
        .addCase(saveMenuItem.rejected, (state, action) => {
            state.actionStatus = 'idle';
        })
        .addCase(removeMenuItem.pending, (state) => {
            state.actionStatus = 'deleting';
        })
        .addCase(removeMenuItem.fulfilled, (state) => {
            state.actionStatus = 'idle';
            state.current = null;
        })
        .addCase(removeMenuItem.rejected, (state) => {
            state.actionStatus = 'idle';
        })
        .addCase(saveMenu.fulfilled, (state, action) => {
            if (action.payload) {
                if (!state.current || state.current.parentId !== action.payload.id) {
                    state.current = {...defaultMenuItem, parentId: action.payload?.id}
                }
            } else {
                state.current = null;
            }
        })
        .addCase(setNewMenu, (state) => {
            state.current = null;
        })
});

export default menuItemReducer;
