import React from 'react';
import AppAlertList from "@/ducks/alerts/AppAlertList";
import MenuList from "@/ducks/menus/MenuList";
import {Outlet} from "react-router";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


export default function AppContent() {
    return (
        <div>
            <AppAlertList/>
            <Row>
                <Col md="4">
                    <MenuList/>
                </Col>
                <Col>
                    <Outlet/>
                </Col>
            </Row>
        </div>
    )
}
