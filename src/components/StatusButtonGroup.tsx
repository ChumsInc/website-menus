import ButtonGroup from "react-bootstrap/ButtonGroup";
import {ToggleButton} from "react-bootstrap";
import {useId} from "react";

export interface StatusButtonGroupProps {
    checked: boolean;
    enabledText?: string;
    disabledText?: string;
    onChange: (checked: boolean) => void;
}

export default function StatusButtonGroup({
                                              checked, enabledText, disabledText, onChange
                                          }: StatusButtonGroupProps) {
    const idEnabled = useId();
    const idDisabled = useId();
    return (
        <ButtonGroup size="sm" role="group">
            <ToggleButton id={idEnabled} value="1" type="checkbox" variant="outline-success"
                          onChange={(ev) => onChange(ev.target.checked)} checked={checked}>
                {enabledText ?? 'Enabled'}
            </ToggleButton>
            <ToggleButton id={idDisabled} value="0" type="checkbox" variant="outline-danger"
                          onChange={(ev) => onChange(!ev.target.checked)} checked={!checked}>
                {disabledText ?? 'Disabled'}
            </ToggleButton>
        </ButtonGroup>
    )

}
