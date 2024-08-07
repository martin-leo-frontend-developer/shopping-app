import { Container } from "react-bootstrap";
import { useRouteError } from "react-router-dom";

export default function Error(){
    const error = useRouteError()
    return(
        <div className="error">
            <Container>
                <h1>Error: {error.message}</h1>
            </Container>
        </div>
    )
}