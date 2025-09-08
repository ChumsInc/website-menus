import AppAlertList from "@/components/alerts/AppAlertList";
import {Outlet} from "react-router";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {ErrorBoundary} from "react-error-boundary";
import errorBoundaryFallback from "@/app/errorBoundayFallback.tsx";
import MenuList from "@/components/menus/MenuList.tsx";
import MenuListFilters from "@/components/menus/MenuListFilters.tsx";


export default function AppContent() {
    return (
        <ErrorBoundary fallbackRender={errorBoundaryFallback}>
            <div>
                <AppAlertList/>
                <Row>
                    <Col md="4">
                        <MenuListFilters/>
                        <MenuList/>
                    </Col>
                    <Col>
                        <Outlet/>
                    </Col>
                </Row>
            </div>
        </ErrorBoundary>
    )
}
