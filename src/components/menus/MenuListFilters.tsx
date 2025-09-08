import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Button, FormCheck} from "react-bootstrap";
import {type ChangeEvent, useId} from "react";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectMenuListLoading, selectMenuListShowInactive, toggleShowInactive} from "@/ducks/menus";
import {loadMenuList} from "@/ducks/menus/actions.ts";

export default function MenuListFilters() {
    const dispatch = useAppDispatch();
    const showInactive = useAppSelector(selectMenuListShowInactive);
    const loading = useAppSelector(selectMenuListLoading);
    const idShowInactive = useId();

    const reloadHandler = () => {
        dispatch(loadMenuList());
    }

    const filterInactiveHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleShowInactive(ev.target.checked));
    }

    return (
        <Row className="row g-3 align-items-baseline mb-1">
            <Col>
                <FormCheck label={'Show Inactive'} id={idShowInactive} checked={showInactive}
                           onChange={filterInactiveHandler}
                           type={"checkbox"} inline/>
            </Col>
            <Col xs="auto">
                <Button type="button" variant="primary" size="sm" disabled={loading}
                        onClick={reloadHandler}>
                    Reload
                </Button>
            </Col>
        </Row>
    )
}
