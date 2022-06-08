import {ActionInterface, ActionPayload} from "chums-ducks";
import {Menu, MenuItem} from "b2b-types";
import {apiActionHelper} from "../utils";
import {number} from "prop-types";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";

export interface EditableMenu extends Menu {
    changed?: boolean,
}

export interface EditableMenuItem extends MenuItem {
    changed?: boolean,
}

export interface MenuPayload extends ActionPayload {
    menu?: Menu,
    props?: Partial<Menu>
    items?: MenuItem[],
    item?: MenuItem,
    itemProps?: Partial<MenuItem>,
}

export interface MenuAction extends ActionInterface {
    payload?: MenuPayload,
}
export interface MenuThunkAction extends ThunkAction<any, RootState, unknown, MenuAction> {
}

export const menuSelected = 'menu/selectMenu';
export const menuItemSelected = 'menu/itemSelected';

export const loadMenu = 'menu/loadMenu';
export const [loadMenuPending, loadMenuResolved, loadMenuRejected] = apiActionHelper(loadMenu);

export const saveMenu = 'menu/saveMenu';
export const [saveMenuPending, saveMenuResolved, saveMenuRejected] = apiActionHelper(saveMenu);

export const deleteMenu = 'menu/deleteMenu';
export const [deleteMenuPending, deleteMenuResolved, deleteMenuRejected] = apiActionHelper(deleteMenu);

export const menuUpdated = 'menu/updated';

export const saveSort = 'menu/saveSort';
export const [saveSortPending, saveSortResolved, saveSortRejected] = apiActionHelper(saveSort);



export const defaultMenu:Menu = {
    id: 0,
    title: '',
    status: 1,
    description: '',
    parents: [],
    items: [],
    className: ''
}

export const defaultMenuItem:MenuItem = {
    id: 0,
    title: '',
    description: '',
    menuId: 0,
    status: 1,
    parentId: 0,
    className: '',
    url: '',
    priority: 0,
}
