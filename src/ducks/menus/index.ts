import {Menu} from "b2b-types";
import {SortProps} from "chums-components";
import {createReducer} from "@reduxjs/toolkit";
import {loadMenuList, setMenuListSort, toggleShowInactive} from "./actions";
import {menuSorter} from "./utils";
import {loadMenu, removeMenu, saveMenu} from "../menu/actions";
import menu from "../menu";

export interface MenusState {
    list: Menu[];
    loading: boolean;
    loaded: boolean;
    sort: SortProps<Menu>;
    showInactive: boolean;
}

export const initialMenusState: MenusState = {
    list: [],
    loading: false,
    loaded: false,
    sort: {field: 'id', ascending: true},
    showInactive: false,
}

const menusReducer = createReducer(initialMenusState, (builder) => {
    builder
        .addCase(loadMenuList.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadMenuList.fulfilled, (state, action) => {
            state.loading = false;
            state.loaded = true;
            state.list = [...action.payload].sort(menuSorter(initialMenusState.sort));
        })
        .addCase(loadMenuList.rejected, (state) => {
            state.loading = false;
        })
        .addCase(toggleShowInactive, (state, action) => {
            state.showInactive = action.payload ?? !state.showInactive;
        })
        .addCase(setMenuListSort, (state, action) => {
            state.sort = action.payload;
        })
        .addCase(loadMenu.fulfilled, (state, action) => {
            if (action.payload) {
                state.list = [
                    ...state.list.filter(menu => menu.id !== action.meta.arg),
                    action.payload
                ].sort(menuSorter(initialMenusState.sort))
            } else {
                state.list = state.list.filter(menu => menu.id !== action.meta.arg).sort(menuSorter(initialMenusState.sort))
            }
        })
        .addCase(saveMenu.fulfilled, (state, action) => {
            if (action.payload) {
                state.list = [
                    ...state.list.filter(menu => menu.id !== action.meta.arg.id),
                    action.payload
                ].sort(menuSorter(initialMenusState.sort))
            } else {
                state.list = state.list.filter(menu => menu.id !== action.meta.arg.id).sort(menuSorter(initialMenusState.sort))
            }
        })
        .addCase(removeMenu.fulfilled, (state, action) => {
            state.list = state.list.filter(menu => menu.id !== action.meta.arg)
                .sort(menuSorter(initialMenusState.sort))
        })
});


export default menusReducer;

