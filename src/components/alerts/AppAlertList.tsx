import {useAppDispatch} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import {AlertList, dismissAlert, selectAllAlerts, type StyledErrorAlert} from '@chumsinc/alert-list'

const AppAlertList = () => {
    const dispatch = useAppDispatch();
    const alerts = useSelector(selectAllAlerts);

    const dismissHandler = (alert: StyledErrorAlert) => dispatch(dismissAlert(alert));

    return (
        <AlertList list={alerts} onDismiss={dismissHandler}/>
    )
}

export default AppAlertList;
