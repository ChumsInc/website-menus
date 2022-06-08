import {RootState} from "../index";


export const selectCurrentMenu = (state:RootState) => state.menu.selected;
export const selectCurrentMenuLoading = (state:RootState) => state.menu.loading;
export const selectCurrentMenuSaving = (state:RootState) => state.menu.saving;

