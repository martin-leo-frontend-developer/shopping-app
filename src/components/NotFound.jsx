import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGlobe } from "@fortawesome/free-solid-svg-icons"
import { Container} from "react-bootstrap"
import { Link } from "react-router-dom"
export default function NotFound(){
    return(
        <div className="not-found d-flex justify-content-center align-items-center">
            <Container className="d-block text-center">
                <h1>The page you were looking for was not found <FontAwesomeIcon icon={faGlobe} /></h1><br/>
                <Link to="/"className="bg-dark py-2 px-5 rounded-2 text-decoration-none text-light" replace>Back Home</Link>              
            </Container>
        </div>
    )
}