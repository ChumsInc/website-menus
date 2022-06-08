import React, {SelectHTMLAttributes} from 'react';
import {useSelector} from "react-redux";
import {menuSorter, selectMenusList} from "./index";

export interface MenuSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    invalid: number[],
}

const MenuSelect:React.FC<MenuSelectProps> = ({value, invalid, onChange, ...rest}) => {
    const list = useSelector(selectMenusList);
    return (
        <select className="form-select form-select-sm" value={value} onChange={onChange} {...rest}>
            <option value="0">-- none --</option>
            {list.sort(menuSorter({field: 'title', ascending: true}))
                .map(menu => (
                    <option key={menu.id} value={menu.id} disabled={!menu.status || invalid.includes(menu.id)}>
                        {menu.title}
                    </option>
                ))}
        </select>
    )
}

export default React.memo(MenuSelect);
