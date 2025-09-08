import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import {alertsSlice} from "@chumsinc/alert-list";
import menusSlice from "@/ducks/menus";
import menuSlice from "@/ducks/menu";
import itemsSlice from "@/ducks/items";
import keywordsSlice from "@/ducks/keywords";
import itemSlice from "@/ducks/item";
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

const rootReducer = combineReducers({
    [alertsSlice.reducerPath]: alertsSlice.reducer,
    [menusSlice.reducerPath]: menusSlice.reducer,
    [menuSlice.reducerPath]: menuSlice.reducer,
    [itemsSlice.reducerPath]: itemsSlice.reducer,
    [keywordsSlice.reducerPath]: keywordsSlice.reducer,
    [itemSlice.reducerPath]: itemSlice.reducer,
})

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActionPaths: ['payload.error', 'meta.arg.signal'],
        }
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


export default store;
