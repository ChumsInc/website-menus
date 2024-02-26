import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {fetchMenuList} from "../../api/menu";
import {RootState} from "../../app/configureStore";
import {selectMenuListLoading} from "./selectors";
import {SortProps} from "chums-components";
import {Menu} from "b2b-types";

export const toggleShowInactive = createAction<boolean|undefined>('menus/showInactive');
export const setMenuListSort = createAction<SortProps<Menu>>('menus/setSort');
export const loadMenuList = createAsyncThunk(
    'menus/load',
    async () => {
        return await fetchMenuList();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectMenuListLoading(state);
        }
    }
)
