import type {Keyword} from "b2b-types";
import Alert from "react-bootstrap/Alert";

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

export default function InactiveKeywordAlert({keyword}:InactiveKeywordAlertProps) {
    if (!keyword || !!keyword.status) {
        return null;
    }
    return (
        <Alert variant="warning">{pageType(keyword)} '<strong>{keyword.title}</strong>' is inactive</Alert>
    )
}
