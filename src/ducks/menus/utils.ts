import {Menu} from "b2b-types";
import {SortProps} from "chums-components";

export const menuSorter = ({field, ascending}: SortProps<Menu>) => (a: Menu, b: Menu) => {
    const ascMod = ascending ? 1 : -1;
    switch (field) {
        case 'id':
            return (a[field] - b[field]) * ascMod;
        case 'title':
        case 'description':
            return (a[field].toLowerCase() === b[field].toLowerCase()
                ? a.id - b.id
                : (a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1)) * ascMod;
        default:
            return (a.id - b.id) * ascMod;
    }
}
