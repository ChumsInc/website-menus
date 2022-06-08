import {Menu, MenuItem} from "b2b-types";
import {fetchJSON} from "chums-ducks";

export const getMenuListAPI =  async (site:string):Promise<Menu[]> => {
    try {
        const url = `/node-${encodeURIComponent(site)}/menus`;
        const {menus} = await fetchJSON<{menus:Menu[]}>(url);
        return menus;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("fetchMenuList()", err.message)
            return Promise.reject(err);
        }
        console.warn("fetchMenuList()", err);
        return Promise.reject(new Error('Error in fetchMenuList()'));
    }
}

export const getMenuAPI = async (site:string, id:number):Promise<Menu|null> => {
    try {
        const url = `/node-${encodeURIComponent(site)}/menus/${encodeURIComponent(id)}`;
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

export const postMenuAPI = async (site:string, _menu:Menu):Promise<Menu> => {
    try {
        const url = `/node-${encodeURIComponent(site)}/menus`;
        const {menu} = await fetchJSON<{menu:Menu}>(url, {method: 'POST', body:JSON.stringify(_menu)});
        return menu;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("saveMenu()", err.message);
            return Promise.reject(err);
        }
        console.warn("saveMenu()", err);
        return Promise.reject(new Error('Error in saveMenu()'));
    }
}

export const deleteMenuAPI = async (site:string, id:number):Promise<void> => {
    try {
        const url = `/node-${encodeURIComponent(site)}/menus/${encodeURIComponent(id)}`;
        await fetchJSON(url, {method: 'DELETE'});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("deleteMenu()", err.message);
            return Promise.reject(err);
        }
        console.warn("deleteMenu()", err);
        return Promise.reject(new Error('Error in deleteMenu()'));
    }
}

export const getMenuItemAPI = async (site:string, parentId: number, id: number):Promise<MenuItem|null> => {
    try {
        const url = `/node-${encodeURIComponent(site)}/menus/${encodeURIComponent(parentId)}/${encodeURIComponent(id)}`;
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

export const postMenuItemAPI = async (site:string, _item:MenuItem):Promise<MenuItem|null> => {
    try {
        const url = `/node-${encodeURIComponent(site)}/menus/item`;
        const {item} = await fetchJSON<{item:MenuItem}>(url, {method: 'POST', body: JSON.stringify(_item)});
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

export const deleteMenuItemAPI = async (site:string, _item:MenuItem):Promise<MenuItem[]> => {
    try {
        const url = `/node-${encodeURIComponent(site)}/menus/${encodeURIComponent(_item.parentId)}/${encodeURIComponent(_item.id)}`;
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

export const saveItemSort = async (site:string, parentId: number, idList:number[]):Promise<MenuItem[]> => {
    try {
        const url = `/node-${encodeURIComponent(site)}/menus/${encodeURIComponent(parentId)}/sort`;
        const {items} = await fetchJSON<{items:MenuItem[]}>(url, {method: 'POST', body: JSON.stringify({items: idList})});
        return items;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("saveItemSort()", err.message);
            return Promise.reject(err);
        }
        console.warn("saveItemSort()", err);
        return Promise.reject(new Error('Error in saveItemSort()'));
    }
}
