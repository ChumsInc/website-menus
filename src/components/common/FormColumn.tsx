import React, {type HTMLAttributes} from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

export interface FormColumnProps {
    width: number;
    label: string;
    children: React.ReactNode;
    labelProps?: HTMLAttributes<HTMLLabelElement>;
}
export default function FormColumn({width, label, labelProps, children}:FormColumnProps) {
    return (
        <Form.Group as={Row}>
            <Form.Label column={true} xs={width} {...labelProps}>{label}</Form.Label>
            <Col>
                {children}
            </Col>
        </Form.Group>
    )
}
