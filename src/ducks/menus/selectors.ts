import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {menuSorter} from "./utils";

export const selectMenuList = (state:RootState) => state.menus.list;
export const selectMenuListLoading = (state:RootState) => state.menus.loading;
export const selectMenuListLoaded = (state:RootState) => state.menus.loaded;
export const selectMenuListSort = (state:RootState) => state.menus.sort;
export const selectMenuListShowInactive = (state:RootState) => state.menus.showInactive;

export const selectSortedMenuList = createSelector(
    [selectMenuList, selectMenuListSort, selectMenuListShowInactive],
    (list, sort, showInactive) => {
        return list
            .filter(item => showInactive || !!item.status)
            .sort(menuSorter(sort));
    }
)

export const selectMenuId = (state:RootState, id?: number) => id ?? null;

export const selectMenuByID = createSelector(
    [selectMenuList, selectMenuId],
    (list, id) => {
        const [menu] = list.filter(menu => menu.id === id);
        return menu ?? null;
    }
)
