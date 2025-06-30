import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchMenuList} from "@/api/menu";
import {RootState} from "@/app/configureStore";
import {selectMenuListLoading} from "./index";

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
