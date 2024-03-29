import React, {SelectHTMLAttributes} from 'react';
import {selectMenuList} from "./selectors";
import {menuSorter} from "./utils";
import {useAppSelector} from "../../app/hooks";


export interface MenuSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    invalid: number[],
}

const MenuSelect = ({value, invalid, onChange, ...rest}: MenuSelectProps) => {
    const list = useAppSelector(selectMenuList);
    return (
        <select className="form-select form-select-sm" value={value} onChange={onChange} {...rest}>
            <option value="0">-- none --</option>
            {[...list]
                .sort(menuSorter({field: 'title', ascending: true}))
                .map(menu => (
                    <option key={menu.id} value={menu.id} disabled={!menu.status || invalid.includes(menu.id)}>
                        {menu.title}
                    </option>
                ))}
        </select>
    )
}

export default MenuSelect;
