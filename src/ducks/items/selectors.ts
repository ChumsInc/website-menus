import {RootState} from "../../app/configureStore";

export const selectItemList = (state: RootState) => state.items.list;
export const selectItemsStatus = (state: RootState) => state.items.status;
export const selectCurrentSort = (state: RootState) => state.items.currentSort;
