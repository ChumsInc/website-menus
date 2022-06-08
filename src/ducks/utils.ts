export type ActionStatus = 'pending'|'resolved'|'rejected';

export const actionHelper = (actionType: string, status: ActionStatus) => `${actionType}/${status}`;
export const apiActionHelper = (actionType: string):[pending:string, resolved:string, rejected: string] =>
    [
        actionHelper(actionType, 'pending'),
        actionHelper(actionType, 'resolved'),
        actionHelper(actionType, 'rejected')
    ];
