import { Container } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { auth } from "./config";
import { useEffect, useState } from "react";



export default function Header(){

    const [user, setUser] = useState(null)

    const navigate = useNavigate()

    const location = useLocation()

    const from = location.state?.from || null

    async function handleLogout(){
        await signOut(auth)
        return navigate("/")
    }  
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (from === "signup" && currentUser) {
                setUser(null);
            } else if (from == null && currentUser) {
                setUser(currentUser); // Set user ID if authenticated
            } else {
                setUser(null); // Set to null if not authenticated
            }
        });
    
        return () => unsubscribe();
    }, [from]);

    return(
        <header className="d-flex align-items-center">
            <Container className="d-flex flex-wrap justify-content-between align-items-center">
                <div className="brand">
                    {user ?  <div className="text-decoration-none text-dark" ><h2 >My<span>Order.</span></h2></div>:  <NavLink className="text-decoration-none text-dark"><h2 >My<span>Order.</span></h2></NavLink>}                   
                </div>
                <nav className="d-flex">
                    { user === null ? 
                    <>
                        <NavLink to="signup" className={({isActive}) => isActive ? "my-link" : null }>Sign Up</NavLink>
                        <NavLink to="login" className={({isActive}) => isActive ? "my-link" : null }>Login</NavLink>  
                    </> : 
                    <button onClick={() => handleLogout()}>Logout <FontAwesomeIcon icon={faRightFromBracket} /></button>  
                    }  
                </nav>
            </Container>                        
        </header>
    )
}