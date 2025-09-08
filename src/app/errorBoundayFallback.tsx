import Alert from "react-bootstrap/Alert";

export interface ErrorBoundaryFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}
export default function errorBoundaryFallback({error, resetErrorBoundary}:ErrorBoundaryFallbackProps) {
    return (
        <Alert variant="danger" onClose={resetErrorBoundary} dismissible>
            <Alert.Heading>Something went wrong.</Alert.Heading>
            <pre style={{whiteSpace: 'pre-wrap'}}>{error.message}</pre>
            <pre style={{whiteSpace: 'pre-wrap'}}>{error.stack}</pre>
        </Alert>
    )
}
