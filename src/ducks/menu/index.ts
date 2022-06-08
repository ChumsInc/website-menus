import {combineReducers} from "redux";
import {siteSelected} from "chums-ducks";
import {
    defaultMenu,
    EditableMenu,
    loadMenuPending,
    loadMenuRejected,
    loadMenuResolved,
    MenuAction, menuSelected,
    menuUpdated,
    saveMenuPending,
    saveMenuRejected,
    saveMenuResolved,
    saveSortResolved
} from "./actionTypes";


const selectedReducer = (state: EditableMenu = defaultMenu, action: MenuAction): EditableMenu => {
    const {type, payload} = action;
    switch (type) {
    case loadMenuResolved:
    case menuSelected:
        if (payload?.menu) {
            return {...payload.menu};
        }
        return {...defaultMenu};
    case siteSelected:
        return {...defaultMenu};
    case menuUpdated:
        if (payload?.props) {
            return {
                ...state,
                ...payload.props,
                changed: true,
            }
        }
        return state;
    case saveSortResolved:
        if (payload?.items) {
            return {...state, items: payload.items}
        }
        return state;
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: MenuAction): boolean => {
    switch (action.type) {
    case loadMenuPending:
        return true;
    case loadMenuResolved:
    case loadMenuRejected:
        return false;
    default:
        return state;
    }
}

const savingReducer = (state: boolean = false, action: MenuAction): boolean => {
    switch (action.type) {
    case saveMenuPending:
        return true;
    case saveMenuResolved:
    case saveMenuRejected:
        return false;
    default:
        return state;
    }
}

export default combineReducers({
    selected: selectedReducer,
    loading: loadingReducer,
    saving: savingReducer,
});
