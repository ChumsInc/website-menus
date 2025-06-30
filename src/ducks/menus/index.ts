import {Menu} from "b2b-types";
import {SortProps} from "chums-types";
import {createEntityAdapter, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadMenuList} from "./actions";
import {loadMenu, removeMenu, saveMenu} from "../menu/actions";
import {menuSorter} from "@/ducks/menus/utils";

const adapter = createEntityAdapter<Menu, number>({
    selectId: (arg) => arg.id,
    sortComparer: (a, b) => a.id - b.id,
})
const selectors = adapter.getSelectors();

export interface MenusState {
    loading: boolean;
    loaded: boolean;
    sort: SortProps<Menu>;
    showInactive: boolean;
}

const extraState: MenusState = {
    loading: false,
    loaded: false,
    sort: {field: 'id', ascending: true},
    showInactive: false,
}
const menusSlice = createSlice({
    name: 'menus',
    initialState: adapter.getInitialState(extraState),
    reducers: {
        setMenuListSort: (state, action: PayloadAction<SortProps<Menu>>) => {
            state.sort = action.payload;
        },
        toggleShowInactive: (state, action: PayloadAction<boolean | undefined>) => {
            state.showInactive = action.payload ?? !state.showInactive;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadMenuList.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadMenuList.fulfilled, (state, action) => {
                state.loading = false;
                state.loaded = true;
                adapter.setAll(state, action.payload);
            })
            .addCase(loadMenuList.rejected, (state) => {
                state.loading = false;
            })
            .addCase(loadMenu.fulfilled, (state, action) => {
                if (action.payload) {
                    adapter.setOne(state, action.payload);
                } else {
                    adapter.removeOne(state, +action.meta.arg);
                }
            })
            .addCase(saveMenu.fulfilled, (state, action) => {
                if (action.payload) {
                    adapter.setOne(state, action.payload);
                } else {
                    adapter.removeOne(state, action.meta.arg.id);
                }
            })
            .addCase(removeMenu.fulfilled, (state, action) => {
                adapter.removeOne(state, action.meta.arg);
            })
    },
    selectors: {
        selectMenuList: (state) => selectors.selectAll(state),
        selectMenuListLoading: (state) => state.loading,
        selectMenuListLoaded: (state) => state.loaded,
        selectMenuListSort: (state) => state.sort,
        selectMenuListShowInactive: (state) => state.showInactive,
        selectMenuById: (state, id: number) => selectors.selectById(state, id) ?? null,
    }
})

export const {setMenuListSort, toggleShowInactive} = menusSlice.actions;
export const {
    selectMenuList,
    selectMenuListLoaded,
    selectMenuListShowInactive,
    selectMenuListSort,
    selectMenuListLoading,
    selectMenuById
} = menusSlice.selectors;

export const selectSortedMenuList = createSelector(
    [selectMenuList, selectMenuListSort, selectMenuListShowInactive],
    (list, sort, showInactive) => {
        return list
            .filter(item => showInactive || !!item.status)
            .sort(menuSorter(sort));
    }
)

export default menusSlice;

