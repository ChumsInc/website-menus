import {useEffect} from 'react';
import MenuEditor from "@/components/menu/MenuEditor.tsx";
import MenuItemList from "@/components/items/MenuItemList.tsx";
import {Outlet, useParams} from "react-router";
import {useAppDispatch} from "@/app/configureStore.ts";
import {loadMenu} from "@/ducks/menu/actions.ts";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export default function EditMenuContent() {
    const dispatch = useAppDispatch();
    const params = useParams<'menuId'>();
    useEffect(() => {
        if (params.menuId) {
            dispatch(loadMenu(params.menuId));
        }
    }, [params.menuId, dispatch]);

    return (
        <Row>
            <Col md="6">
                <h2>Edit Menu</h2>
                <MenuEditor/>
                <hr />
                <MenuItemList/>
            </Col>
            <Col md="6">
                <h2>Edit Item</h2>
                <Outlet/>
            </Col>
        </Row>
    )
}
