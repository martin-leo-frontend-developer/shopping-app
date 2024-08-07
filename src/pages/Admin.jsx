import { Container } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";

export default function Admin(){ 
    return( 
            <div className="admin">
                <Container>
                    <nav className="d-flex py-4">
                        <NavLink to="admin" end   className={({isActive}) => isActive ? "admin-link" : null }>Add product</NavLink>
                        <NavLink to="view-purchase" className={({isActive}) => isActive ? "admin-link" : null }>View Product</NavLink>
                    </nav>
                    <Outlet/>
                    
                </Container>
            </div>
    )
}