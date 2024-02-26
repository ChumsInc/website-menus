import {Menu, MenuItem} from "b2b-types";

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
