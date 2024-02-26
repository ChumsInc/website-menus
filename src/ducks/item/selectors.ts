import {RootState} from "../../app/configureStore";

export const selectCurrentMenuItem = (state:RootState) => state.menuItem.current;
export const selectCurrentMenuItemStatus = (state:RootState) => state.menuItem.actionStatus;
