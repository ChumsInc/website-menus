import {Menu, MenuItem} from "b2b-types";
import {fetchJSON} from "chums-components";
import {MenuItemArg} from "../types";

export const fetchMenuList =  async ():Promise<Menu[]> => {
    try {
        const url = `/api/b2b/menus`;
        const res = await fetchJSON<{menus:Menu[]}>(url);
        return res.menus ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("fetchMenuList()", err.message)
            return Promise.reject(err);
        }
        console.warn("fetchMenuList()", err);
        return Promise.reject(new Error('Error in fetchMenuList()'));
    }
}

export const fetchMenu = async (id:number):Promise<Menu|null> => {
    try {
        const url = `/api/b2b/menus/${encodeURIComponent(id)}`;
        const {menus} = await fetchJSON<{menus:Menu[]}>(url);
        if (!menus.length) {
            return null;
        }
        const [menu] = menus;
        return menu;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("fetchMenu()", err.message);
            return Promise.reject(err);
        }
        console.warn("fetchMenu()", err);
        return Promise.reject(new Error('Error in fetchMenu()'));
    }
}

export const postMenu = async (arg:Menu):Promise<Menu|null> => {
    try {
        const url = `/api/b2b/menus`;
        const res = await fetchJSON<{menu:Menu}>(url, {method: 'POST', body:JSON.stringify(arg)});
        return res.menu ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("saveMenu()", err.message);
            return Promise.reject(err);
        }
        console.warn("saveMenu()", err);
        return Promise.reject(new Error('Error in saveMenu()'));
    }
}

export const deleteMenuAPI = async (arg:number):Promise<void> => {
    try {
        const url = `/api/b2b/menus/${encodeURIComponent(arg)}`;
        await fetchJSON(url, {method: 'DELETE'});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("removeMenu()", err.message);
            return Promise.reject(err);
        }
        console.warn("removeMenu()", err);
        return Promise.reject(new Error('Error in removeMenu()'));
    }
}

export const fetchMenuItem = async (arg: MenuItemArg):Promise<MenuItem|null> => {
    try {
        const url = `/api/b2b/menus/${encodeURIComponent(arg.parentId)}/${encodeURIComponent(arg.id)}`;
        const {items} = await fetchJSON<{items:MenuItem[]}>(url);
        if (!items.length) {
            return null;
        }
        const [item] = items;
        return item;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("loadMenuItem()", err.message);
            return Promise.reject(err);
        }
        console.warn("loadMenuItem()", err);
        return Promise.reject(new Error('Error in loadMenuItem()'));
    }
}

export const postMenuItemAPI = async (arg:MenuItem):Promise<MenuItem|null> => {
    try {
        const url = `/api/b2b/menus/item`;
        const {item} = await fetchJSON<{item:MenuItem}>(url, {method: 'POST', body: JSON.stringify(arg)});
        return item;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("saveMenuItem()", err.message);
            return Promise.reject(err);
        }
        console.warn("saveMenuItem()", err);
        return Promise.reject(new Error('Error in saveMenuItem()'));
    }
}

export const deleteMenuItemAPI = async (arg:MenuItemArg):Promise<MenuItem[]> => {
    try {
        const url = `/api/b2b/menus/${encodeURIComponent(arg.parentId)}/${encodeURIComponent(arg.id)}`;
        const {items} = await fetchJSON<{items:MenuItem[]}>(url, {method: 'DELETE'});
        return items || [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("deleteMenuItem()", err.message);
            return Promise.reject(err);
        }
        console.warn("deleteMenuItem()", err);
        return Promise.reject(new Error('Error in deleteMenuItem()'));
    }
}

export const postItemSort = async (parentId: number, idList:number[]):Promise<MenuItem[]> => {
    try {
        const url = `/api/b2b/menus/${encodeURIComponent(parentId)}/sort`;
        const {items} = await fetchJSON<{items:MenuItem[]}>(url, {method: 'POST', body: JSON.stringify({items: idList})});
        return items;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("postItemSort()", err.message);
            return Promise.reject(err);
        }
        console.warn("postItemSort()", err);
        return Promise.reject(new Error('Error in postItemSort()'));
    }
}
