import React, {ChangeEvent, FormEvent} from 'react';
import {MenuItem} from "b2b-types";
import {useAppSelector} from "@/app/hooks";
import {selectItemsStatus} from "@/ducks/items";
import FormColumn from "@/components/FormColumn";
import StatusButtonGroup from "@/components/StatusButtonGroup";
import MenuSelect from "@/ducks/menus/MenuSelect";
import MenuInactiveAlert from "@/ducks/menus/MenuInactiveAlert";
import {Button} from "react-bootstrap";

export interface ItemEditorUIProps {
    item: MenuItem;
    changed?: boolean;
    onChangeItem: (item: MenuItem) => void;
    onSaveItem: () => void;
    onNewItem: () => void;
    onDeleteItem: () => void;
}

export default function ItemEditorUI({
                                         item,
                                         changed,
                                         onChangeItem,
                                         onSaveItem,
                                         onNewItem,
                                         onDeleteItem
                                     }: ItemEditorUIProps) {
    const actionStatus = useAppSelector(selectItemsStatus);

    const statusChangeHandler = (checked: boolean) => {
        onChangeItem({...item, status: checked ? 1 : 0});
    }

    const changeHandler = (field: keyof MenuItem) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        switch (field) {
            case 'title':
            case 'description':
            case 'url':
            case 'className':
                onChangeItem({...item, [field]: ev.target.value});
                return;
            case 'status':
                onChangeItem({...item, [field]: (ev as ChangeEvent<HTMLInputElement>).target.checked});
                return;
            case 'menuId':
                onChangeItem({...item, [field]: +(ev as ChangeEvent<HTMLSelectElement>).target.value});
        }
    }

    const menuChangeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const id = Number(ev.target.value);
        onChangeItem({...item, menuId: id});
    }

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        onSaveItem();
    }

    const newItemHandler = () => {
        if (!changed || window.confirm("Are you sure you want to lose changes to this item?")) {
            onNewItem();
        }
    }

    const deleteItemHandler = () => {
        if (!changed || window.confirm("Are you sure you want to delete this item?")) {
            onDeleteItem();
        }
    }

    return (
        <form onSubmit={submitHandler}>
            <FormColumn label="ID / Status" width={4}>
                <div className="row g-3 align-items-baseline">
                    <div className="col-6">
                        <input type="text" readOnly className="form-control form-select-sm"
                               value={[item.parentId, item.id].join(' : ')}/>
                    </div>
                    <div className="col-6">
                        <StatusButtonGroup checked={!!item.status} onChange={statusChangeHandler}/>
                    </div>
                </div>
            </FormColumn>
            <FormColumn width={4} label="Title">
                <input type="text" className="form-control form-select-sm" required
                       value={item.title} onChange={changeHandler('title')}/>
            </FormColumn>
            <FormColumn width={4} label="Hover Text">
                <textarea className="form-control form-select-sm mb-1"
                          value={item.description} onChange={changeHandler("description")}/>
            </FormColumn>
            <FormColumn width={4} label="Menu">
                <MenuSelect value={item.menuId} invalid={[item.parentId, ...(item.menu?.parents || [])]}
                            onChange={menuChangeHandler}/>
                <MenuInactiveAlert menuId={item.menuId}/>
            </FormColumn>
            <FormColumn width={4} label="URL">
                <input type="text" className="form-control form-select-sm"
                       value={item.url} onChange={changeHandler('url')}/>
                <small className="text-muted">If outside of domain, make sure to include &#39;https://&#39;</small>
            </FormColumn>
            <FormColumn width={4} label="CSS className">
                <input type="text" className="form-control form-select-sm"
                       value={item.className} onChange={changeHandler('className')}/>
            </FormColumn>

            <FormColumn width={4} label={' '}>
                <div className="row g-3">
                    <div className="col-auto">
                        <Button type="submit"
                                disabled={actionStatus !== 'idle' || (item.menuId === 0 && item.url === '')}
                                className="btn btn-sm btn-primary">
                            Save
                        </Button>
                    </div>
                    <div className="col-auto">
                        <button type="button" onClick={newItemHandler}
                                className="btn btn-sm btn-outline-secondary">
                            New Item
                        </button>
                    </div>
                    <div className="col-auto">
                        <button type="button" onClick={deleteItemHandler}
                                className="btn btn-sm btn-outline-danger mr-1"
                                disabled={item.id === 0 || actionStatus !== 'idle'}>
                            Delete
                        </button>
                    </div>
                </div>
            </FormColumn>
        </form>
    )
}
