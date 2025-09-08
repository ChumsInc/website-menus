import {createAsyncThunk} from "@reduxjs/toolkit";
import type {MenuItem} from "b2b-types";
import {type RootState} from "@/app/configureStore.ts";
import {selectCurrentMenu} from "../menu";
import {postItemSort} from "@/api/menu.ts";
import {selectItemsStatus} from "./index";

export const saveItemSort = createAsyncThunk<MenuItem[], MenuItem[]>(
    'items/saveSort',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const currentMenu = selectCurrentMenu(state);
        return await postItemSort(currentMenu!.id, arg.map(item => item.id))
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            const status = selectItemsStatus(state);
            const currentMenu = selectCurrentMenu(state);
            return !!currentMenu?.id && arg.length > 0 && status === 'idle';
        }
    }
)
