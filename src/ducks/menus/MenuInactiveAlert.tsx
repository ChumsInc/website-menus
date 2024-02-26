import React from 'react';
import {Alert} from "chums-components";
import {useAppSelector} from "../../app/hooks";
import {selectMenuByID} from "./selectors";

export interface MenuInactiveAlertProps {
    menuId?: number,
}

const MenuInactiveAlert: React.FC<MenuInactiveAlertProps> = ({menuId}: MenuInactiveAlertProps) => {
    const menu = useAppSelector((state) => selectMenuByID(state, menuId));
    if (!menuId) {
        return null;
    }
    if (!menu) {
        return (<Alert color="danger">Menu ID '{menuId}' not found</Alert>);
    }
    if (!menu.status) {
        return (<Alert color="warning">Menu '{menu.title}' is inactive</Alert>);
    }
    return null;
}

export default MenuInactiveAlert;
