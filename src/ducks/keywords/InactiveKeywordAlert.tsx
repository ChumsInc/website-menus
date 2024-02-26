import React from 'react';
import {Keyword} from "b2b-types";
import {Alert} from "chums-components";

export interface InactiveKeywordAlertProps {
    keyword?: Keyword|null,
}

const pageType = (kw:Keyword) => {
    switch (kw.pagetype) {
    case 'page':
        return 'Page';
    case 'product':
        return 'Product';
    case 'category':
        return 'Category'
    default: return '???'
    }
}

const InactiveKeywordAlert:React.FC<InactiveKeywordAlertProps> = ({keyword}) => {
    if (!keyword || !!keyword.status) {
        return null;
    }
    return (
        <Alert color="warning">{pageType(keyword)} '<strong>{keyword.title}</strong>' is inactive</Alert>
    )
}
export default InactiveKeywordAlert;
