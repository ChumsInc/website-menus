import type {MenuItem} from "b2b-types";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {loadMenuItem, removeMenuItem, saveMenuItem} from "./actions";
import {loadMenu, saveMenu, setCurrentMenu} from "@/ducks/menu/actions";

export type ItemStatus = 'idle' | 'loading' | 'saving' | 'deleting';

export interface MenuItemState {
    current: MenuItem | null;
    actionStatus: ItemStatus;
}

export const defaultMenuItem: MenuItem = {
    id: 0,
    title: '',
    description: '',
    menuId: 0,
    status: true,
    parentId: 0,
    className: '',
    url: '',
    priority: 0,
}

const initialState: MenuItemState = {
    current: null,
    actionStatus: 'idle',
}


const itemSlice = createSlice({
    name: 'menuItem',
    initialState: initialState,
    reducers: {
        updateMenuItem: (state, action: PayloadAction<Partial<MenuItem>>) => {
            if (state.current) {
                state.current = {...state.current, ...action.payload};
            }
        },
        setCurrentMenuItem: (state, action: PayloadAction<MenuItem | null>) => {
            state.current = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadMenuItem.pending, (state, action) => {
                state.actionStatus = 'loading'
                if (state.current && state.current.id !== +action.meta.arg.id) {
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
                        state.current = {...defaultMenuItem, parentId: action.payload.id}
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
            .addCase(saveMenuItem.rejected, (state) => {
                state.actionStatus = 'idle';
            })
            .addCase(removeMenuItem.pending, (state) => {
                state.actionStatus = 'deleting';
            })
            .addCase(removeMenuItem.fulfilled, (state, action) => {
                state.actionStatus = 'idle';
                state.current = {...defaultMenuItem, parentId: +action.meta.arg.parentId};
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
            .addCase(setCurrentMenu, (state, action) => {
                if (!action.payload) {
                    state.current = null;
                }
            })
    },
    selectors: {
        selectCurrentMenuItem: (state) => state.current,
        selectCurrentMenuItemStatus: (state) => state.actionStatus,
    }
})
export default itemSlice;
export const {updateMenuItem, setCurrentMenuItem} = itemSlice.actions;
export const {selectCurrentMenuItem, selectCurrentMenuItemStatus} = itemSlice.selectors;


