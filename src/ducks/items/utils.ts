import type {MenuItem} from "b2b-types";

export const prioritySort = (a: MenuItem, b: MenuItem) => a.priority - b.priority;

export const sortOrderKey = (list: MenuItem[]):string => [...list].sort(prioritySort).map(i => i.id).join(':');

