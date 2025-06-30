import {Menu} from "b2b-types";
import {Editable} from "b2b-types/src/generic";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadMenu, removeMenu, saveMenu, saveMenuSort} from "./actions";
import {defaultMenu} from "../utils";

export type MenuActionStatus = 'idle' | 'saving' | 'saving-sort' | 'deleting' | 'loading'

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
    initialState: initialState,
    reducers: {
        setCurrentMenu: (state, action: PayloadAction<Menu | null>) => {
            state.current = action.payload ?? {...defaultMenu};
        },
        updateMenu: (state, action: PayloadAction<Partial<Menu>>) => {
            state.current = {...state.current, ...action.payload};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadMenu.pending, (state) => {
                state.actionStatus = 'loading';
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
        selectCurrentMenuLoading: (state) => state.actionStatus === 'loading',
        selectCurrentMenuSaving:  (state) => state.actionStatus === 'saving',
    }
})
export const {updateMenu, setCurrentMenu} = menuSlice.actions;
export const {selectCurrentMenuSaving, selectCurrentMenuStatus, selectCurrentMenuLoading, selectCurrentMenu} = menuSlice.selectors;

export const isMenuPayload = (payload: unknown|Menu|null): payload is Menu => {
    return !!payload && (payload as Menu).id > 0;
}

export default menuSlice;
