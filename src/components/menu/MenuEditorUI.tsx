import {type ChangeEvent, type FormEvent} from 'react';
import type {Menu} from "b2b-types";
import StatusButtonGroup from "@/components/common/StatusButtonGroup.tsx";
import FormColumn from "@/components/common/FormColumn.tsx";
import {Button} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import type {MenuActionStatus} from "@/src/types.ts";


export interface MenuEditorUIProps {
    menu: Menu;
    changed?: boolean
    status: MenuActionStatus;
    onChangeMenu: (menu: Menu) => void;
    onSave: () => void;
    onReload: () => void;
    onNewMenu: () => void;
    onDeleteMenu: () => void;

}

export default function MenuEditorUI({
                                         menu,
                                         changed,
                                         status,
                                         onChangeMenu,
                                         onSave,
                                         onReload,
                                         onNewMenu,
                                         onDeleteMenu
                                     }: MenuEditorUIProps) {
    const changeHandler = (field: keyof Menu) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
            case 'title':
            case 'className':
            case 'description':
                onChangeMenu({...menu, [field]: ev.target.value});
                return;
            case 'status':
                onChangeMenu({...menu, [field]: ev.target.checked});
                return;
        }
    }

    const onChangeStatus = (checked: boolean) => {
        onChangeMenu({...menu, status: checked});
    }

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        onSave();
    }

    const newMenuHandler = () => {
        if (!changed || window.confirm('This menu is changed. Do you want to lose your changes?')) {
            onNewMenu();
        }
    }

    const deleteMenuHandler = async () => {
        if (!menu.id) {
            return;
        }
        if (window.confirm('Are you sure you want to delete this menu?')) {
            onDeleteMenu();
        }
    }

    const reloadHandler = () => {
        if (!menu.id) {
            return;
        }
        if (!changed || window.confirm('This menu is changed. Do you want to lose your changes?')) {
            onReload();
        }
    }


    return (
        <form onSubmit={submitHandler} className="my-3">
            <FormColumn label="ID / Status" width={4}>
                <div className="row g-3">
                    <div className="col-6">
                        <input type="text" readOnly value={menu.id} className="form-control form-control-sm"/>
                    </div>
                    <div className="col-6">
                        <StatusButtonGroup checked={!!menu.status} onChange={onChangeStatus}/>
                    </div>
                </div>
            </FormColumn>
            <FormColumn label="Title" width={4}>
                <input type="text" placeholder="Title" className="form-control form-control-sm"
                       value={menu.title} onChange={changeHandler('title')}/>
            </FormColumn>
            <FormColumn label="Description" width={4}>
                <input type="text" placeholder="Description" className="form-control form-control-sm"
                       value={menu.description} onChange={changeHandler('description')}/>
                <small className="text-muted">Used for aria-description and hover text</small>
            </FormColumn>
            <FormColumn label="CSS Class" width={4}>
                <input type="text" placeholder="" className="form-control form-control-sm"
                       value={menu.className} onChange={changeHandler('className')}/>
            </FormColumn>
            <Row className="g-3 justify-content-end">
                <Col xs="auto">
                    <Button onClick={reloadHandler} variant="outline-secondary" size="sm"
                            disabled={status !== 'idle' || menu.id === 0}>
                        Reload
                    </Button>
                </Col>
                <Col/>
                <Col xs="auto">
                    <Button type="submit" size="sm" variant={changed ? 'warning' : 'primary'}
                            disabled={status !== 'idle'}>
                        Save
                    </Button>
                </Col>
                <Col xs="auto">
                    <Button type="button" size="sm" variant="outline-secondary"
                            disabled={status !== 'idle'} onClick={newMenuHandler}>
                        New Menu
                    </Button>
                </Col>
                <Col xs="auto">
                    <Button type="button" size="sm" variant="outline-danger"
                            onClick={deleteMenuHandler}
                            disabled={!menu.id || (menu.items || []).length > 0 || menu.id === 1 || status === 'idle'}>
                        Delete
                    </Button>
                </Col>
            </Row>
        </form>
    )
}
