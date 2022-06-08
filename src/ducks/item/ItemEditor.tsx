import React, {ChangeEvent, FormEvent} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    deleteMenuItemAction,
    saveMenuItemAction,
    selectCurrentItem,
    selectCurrentItemSaving,
    selectCurrentLoading,
    selectItemAction,
    updateItemAction
} from "./index";
import {MenuItem} from "b2b-types";
import {Alert, FormColumn, SpinnerButton, StatusButtonGroup} from "chums-ducks";
import MenuSelect from "../menus/MenuSelect";
import MenuInactiveAlert from "../menus/MenuInactiveAlert";
import {selectCurrentMenu} from "../menu/selectors";
import {defaultMenuItem} from "../menu/actionTypes";
import URLBuilder from "../keywords/URLBuilder";

const ItemEditor: React.FC = () => {
    const dispatch = useDispatch();
    const parentMenu = useSelector(selectCurrentMenu);
    const item = useSelector(selectCurrentItem);
    const loading = useSelector(selectCurrentLoading)
    const saving = useSelector(selectCurrentItemSaving);

    const changeHandler = (field: keyof MenuItem) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        switch (field) {
        case 'title':
        case 'description':
        case 'url':
        case 'className':
            dispatch(updateItemAction({[field]: ev.target.value}));
        }
    }

    const menuChangeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const id = Number(ev.target.value);
        dispatch(updateItemAction({menuId: id}));
    }
    const statusChangeHandler = (checked: boolean) => dispatch(updateItemAction({status: checked ? 1 : 0}));

    const newItemHandler = () => dispatch(selectItemAction({...defaultMenuItem, parentId: parentMenu.id}));

    const deleteHandler = () => dispatch(deleteMenuItemAction());

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveMenuItemAction());
    }

    if (!parentMenu.id) {
        return (<Alert color="info">Select a parent menu first.</Alert> )
    }
    return (
        <>
            <form onSubmit={submitHandler}>
                <FormColumn label="ID / Status" width={8}>
                    <div className="row g-3 align-items-baseline">
                        <div className="col-6">
                            <input type="text" readOnly className="form-control form-select-sm" value={[item.parentId, item.id].join(' : ')}/>
                        </div>
                        <div className="col-6">
                            <StatusButtonGroup checked={!!item.status} onChange={statusChangeHandler}/>
                        </div>
                    </div>
                </FormColumn>
                <FormColumn width={8} label="Title">
                    <input type="text" className="form-control form-select-sm" required
                           value={item.title} onChange={changeHandler('title')}/>
                </FormColumn>
                <FormColumn width={8} label="Hover Text">
                <textarea className="form-control form-select-sm mb-1"
                          value={item.description} onChange={changeHandler("description")}/>
                </FormColumn>
                <FormColumn width={8} label="Menu">
                    <MenuSelect value={item.menuId} invalid={[item.parentId, ...(item.menu?.parents || [])]}
                                onChange={menuChangeHandler}/>
                    <MenuInactiveAlert menuId={item.menuId}/>
                </FormColumn>
                <FormColumn width={8} label="URL">
                    <input type="text" className="form-control form-select-sm"
                           value={item.url} onChange={changeHandler('url')}/>
                    <small className="text-muted">If outside of domain, make sure to include 'https://'</small>
                </FormColumn>
                <FormColumn width={8} label="CSS className">
                    <input type="text" className="form-control form-select-sm"
                           value={item.className} onChange={changeHandler('className')}/>
                </FormColumn>

                <FormColumn width={8} label={' '}>
                    <div className="row g-3">
                        <div className="col-auto">
                            <SpinnerButton type="submit"
                                           disabled={saving || loading || (item.menuId === 0 && item.url === '')}
                                           spinning={saving}
                                           className="btn btn-sm btn-primary">Save</SpinnerButton>
                        </div>
                        <div className="col-auto">
                            <button type="button" onClick={newItemHandler}
                                    className="btn btn-sm btn-outline-secondary">New Item
                            </button>
                        </div>
                        <div className="col-auto">
                            <button type="button" onClick={deleteHandler}
                                    className="btn btn-sm btn-outline-danger mr-1" disabled={item.id === 0}>Delete
                            </button>
                        </div>
                    </div>
                </FormColumn>
                {item.changed && <Alert color="warning" message="Don't forget to save."/>}
            </form>
            <URLBuilder url={item.url} onSelectUrl={(url) => dispatch(updateItemAction({url: url}))} />
        </>
    )
}

export default ItemEditor;
