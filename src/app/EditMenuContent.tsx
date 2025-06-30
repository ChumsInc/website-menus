import React, {useEffect} from 'react';
import MenuEditor from "@/components/MenuEditor";
import MenuItemList from "@/components/items/MenuItemList";
import {Outlet, useParams} from "react-router";
import {useAppDispatch} from "@/app/hooks";
import {loadMenu} from "@/ducks/menu/actions";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export default function EditMenuContent() {
    const dispatch = useAppDispatch();
    const params = useParams<'menuId'>();
    useEffect(() => {
        if (params.menuId) {
            dispatch(loadMenu(params.menuId));
        }
    }, [params.menuId]);

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
