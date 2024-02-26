import React, {ChangeEvent, FormEvent} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentMenu, selectCurrentMenuLoading} from "./selectors";
import {Menu} from "b2b-types";
import {saveMenu, setNewMenu, updateMenu} from "./actions";
import {Alert, FormColumn, LoadingProgressBar, StatusButtonGroup} from "chums-components";
import {useAppDispatch} from "../../app/hooks";

type EditableMenuField = keyof Omit<Menu, 'id' | 'items' | 'parents'>;

const MenuEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const menu = useSelector(selectCurrentMenu);
    const loading = useSelector(selectCurrentMenuLoading);

    const changeHandler = (field: EditableMenuField) => (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(updateMenu({[field]: ev.target.value}))
    }

    const onChangeStatus = (checked: boolean) => dispatch(updateMenu({status: checked}));

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        if (!menu) {
            return;
        }
        dispatch(saveMenu(menu));
    }

    const onNewMenu = () => {
        if (!menu?.changed || window.confirm('This menu is changed. Do you want to lose your changes?')) {
            dispatch(setNewMenu())
        }
    }

    const onDeleteMenu = () => {
        if (!menu?.changed || window.confirm('This menu is changed. Do you want to lose your changes?')) {
            // dispatch(loadMenuAction())
        }
    }

    if (!menu) {
        return null;
    }

    return (
        <div className="mb-1">
            <form onSubmit={submitHandler} className="my-3">
                <FormColumn label="ID / Status" width={8}>
                    <div className="row g-3">
                        <div className="col-6">
                            <input type="text" readOnly value={menu.id} className="form-control form-control-sm"/>
                        </div>
                        <div className="col-6">
                            <StatusButtonGroup checked={!!menu.status} onChange={onChangeStatus}/>
                        </div>
                    </div>
                </FormColumn>
                <FormColumn label="Title" width={8}>
                    <input type="text" placeholder="Title" className="form-control form-control-sm"
                           value={menu.title} onChange={changeHandler('title')}/>
                </FormColumn>
                <FormColumn label="Description" width={8}>
                    <input type="text" placeholder="Description" className="form-control form-control-sm"
                           value={menu.description} onChange={changeHandler('description')}/>
                    <small className="text-muted">Used for aria-description and hover text</small>
                </FormColumn>
                <FormColumn label="CSS Class" width={8}>
                    <input type="text" placeholder="" className="form-control form-control-sm"
                           value={menu.className} onChange={changeHandler('className')}/>
                </FormColumn>
                <FormColumn width={8} label={' '}>
                    <div className="row g-3">
                        <div className="col-auto">
                            <button type="submit" className="btn btn-sm btn-primary">
                                Save
                            </button>
                        </div>
                        <div className="col-auto">
                            <button type="button" className="btn btn-sm btn-outline-secondary mr-1"
                                    onClick={onNewMenu}>
                                New Menu
                            </button>
                        </div>
                        <div className="col-auto">
                            <button type="button" className="btn btn-sm btn-outline-danger mr-1"
                                    onClick={onDeleteMenu}
                                    disabled={!menu.id || (menu.items || []).length > 0 || menu.id === 1}>
                                Delete
                            </button>
                        </div>
                    </div>
                </FormColumn>
                {menu.changed && <Alert color="warning" message="Don't forget to save your changes"/>}
            </form>
            {loading && <LoadingProgressBar animated striped/>}
        </div>
    )
}

export default MenuEditor;
