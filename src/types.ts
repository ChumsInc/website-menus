import {MenuItem} from "b2b-types";

export interface NothingHereYet {
    id: number,
    title: string,
    description: string,
    className: string,
    status: 1|0,
}

export interface MenuItemArg {
    parentId: number|string;
    id: number|string;
}
