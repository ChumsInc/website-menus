import {Menu} from "b2b-types";
import {Editable} from "b2b-types/src/generic";
import {createReducer} from "@reduxjs/toolkit";
import {loadMenu, removeMenu, saveMenu, saveMenuSort, setNewMenu, updateMenu} from "./actions";
import {defaultMenu} from "../utils";

export interface MenuState {
    current: Menu & Editable;
    actionStatus: 'idle' | 'saving' | 'saving-sort' | 'deleting' | 'loading';
}

const initialState: MenuState = {
    current: {...defaultMenu},
    actionStatus: "idle",
}

const menuReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(updateMenu, (state, action) => {
            if (state.current) {
                state.current = {...state.current, ...action.payload, changed: true};
            }
        })
        .addCase(loadMenu.pending, (state, action) => {
            state.actionStatus = 'loading';
            if (state.current && action.payload !== state.current.id) {
                state.current = {...defaultMenu};
            }
        })
        .addCase(loadMenu.fulfilled, (state, action) => {
            state.actionStatus = 'idle';
            state.current = action.payload ?? {...defaultMenu};
        })
        .addCase(loadMenu.rejected, (state) => {
            state.actionStatus = 'idle';
        })
        .addCase(saveMenu.pending, (state) => {
            state.actionStatus = 'saving';
        })
        .addCase(saveMenu.fulfilled, (state, action) => {
            state.actionStatus = 'idle';
            state.current = action.payload ?? {...defaultMenu};
        })
        .addCase(saveMenu.rejected, (state) => {
            state.actionStatus = 'idle';
        })
        .addCase(saveMenuSort.pending, (state) => {
            state.actionStatus = 'saving-sort';
        })
        .addCase(saveMenuSort.fulfilled, (state) => {
            state.actionStatus = 'idle';
        })
        .addCase(saveMenuSort.rejected, (state) => {
            state.actionStatus = 'idle';
        })
        .addCase(removeMenu.pending, (state) => {
            state.actionStatus = 'deleting';
        })
        .addCase(removeMenu.fulfilled, (state) => {
            state.actionStatus = 'idle';
            state.current = null ?? {...defaultMenu};
        })
        .addCase(removeMenu.rejected, (state) => {
            state.actionStatus = 'idle';
        })
        .addCase(setNewMenu, (state) => {
            state.current = {...defaultMenu};
        })
})

export default menuReducer;
