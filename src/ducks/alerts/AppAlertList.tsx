import React from 'react';
import {useAppDispatch} from "@/app/hooks";
import {useSelector} from "react-redux";
import {AlertList, dismissAlert, selectAllAlerts, StyledErrorAlert} from '@chumsinc/alert-list'

const AppAlertList = () => {
    const dispatch = useAppDispatch();
    const alerts = useSelector(selectAllAlerts);

    const dismissHandler = (alert: StyledErrorAlert) => dispatch(dismissAlert(alert));

    return (
        <AlertList list={alerts} onDismiss={dismissHandler}/>
    )
}

export default AppAlertList;
