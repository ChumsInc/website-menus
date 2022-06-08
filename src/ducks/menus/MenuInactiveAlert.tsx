import React from 'react';
import {useSelector} from "react-redux";
import {selectMenusList} from "./index";
import {Alert} from "chums-ducks";

export interface MenuInactiveAlertProps {
    menuId?: number,
}
const MenuInactiveAlert:React.FC<MenuInactiveAlertProps> = ({menuId}) => {
    const list = useSelector(selectMenusList);
    const [menu] = list.filter(menu => menu.id === menuId);
    if (!!menuId && !menu) {
        return (<Alert color="danger">Menu ID '{menuId}' not found</Alert> );
    }
    if (!!menuId && !menu.status) {
        return (<Alert color="warning">Menu '{menu.title}' is inactive</Alert> );
    }
    return null;
}

export default React.memo(MenuInactiveAlert);
