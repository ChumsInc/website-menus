import Alert from "react-bootstrap/Alert";
import {useAppSelector} from "@/app/configureStore";
import {selectMenuById} from "@/ducks/menus";

export interface MenuInactiveAlertProps {
    menuId?: number,
}

const MenuInactiveAlert = ({menuId}: MenuInactiveAlertProps) => {
    const menu = useAppSelector((state) => selectMenuById(state, menuId ?? 0));
    if (!menuId) {
        return null;
    }
    if (!menu) {
        return (<Alert variant="danger">Menu ID '{menuId}' not found</Alert>);
    }
    if (!menu.status) {
        return (<Alert variant="warning">Menu '{menu.title}' is inactive</Alert>);
    }
    return null;
}

export default MenuInactiveAlert;
