import {RootState} from "../../app/configureStore";


export const selectCurrentMenu = (state:RootState) => state.menu.current;
export const selectCurrentMenuStatus = (state:RootState) => state.menu.actionStatus;
export const selectCurrentMenuLoading = (state:RootState) => state.menu.actionStatus === 'loading';
export const selectCurrentMenuSaving = (state:RootState) => state.menu.actionStatus === 'saving';

