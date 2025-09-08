import type {Editable, Menu} from "b2b-types";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {loadMenu, removeMenu, saveMenu, saveMenuSort, setCurrentMenu, setNewMenu} from "./actions";
import {defaultMenu} from "../utils";
import type {MenuActionStatus} from "@/src/types.ts";

export interface MenuState {
    current: Menu & Editable;
    actionStatus: MenuActionStatus;
}

const initialState: MenuState = {
    current: {...defaultMenu},
    actionStatus: "idle",
}

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        updateMenu: (state, action: PayloadAction<Partial<Menu>>) => {
            state.current = {...state.current, ...action.payload, changed: true};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(setNewMenu, (state) => {
                state.current = {...defaultMenu};
            })
            .addCase(setCurrentMenu, (state, action) => {
                state.current = action.payload ?? {...defaultMenu};
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
                state.current = {...defaultMenu};
            })
            .addCase(removeMenu.rejected, (state) => {
                state.actionStatus = 'idle';
            })
    },
    selectors: {
        selectCurrentMenu: (state) => state.current,
        selectCurrentMenuStatus: (state) => state.actionStatus,
    }
})
export default menuSlice;
export const {updateMenu} = menuSlice.actions;
export const {selectCurrentMenuStatus, selectCurrentMenu} = menuSlice.selectors;
