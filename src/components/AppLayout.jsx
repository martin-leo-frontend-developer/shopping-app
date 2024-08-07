import { Outlet,  useNavigate } from "react-router-dom";
import Header from "./Header";
import { auth } from "./config";
import { useEffect, useState } from "react";

export default function AppLayout(){

    const [user, setUser ] = useState()
    
    const navigate = useNavigate()

    useEffect(() => {
        const unsubcribe = auth.onAuthStateChanged( (curentUser) => {
            setUser(curentUser)
        })

        return () => unsubcribe()

    },[])

    useEffect(() => {
        if (!user) return;  // Early return if user is null or undefined
    
        if (user.email === "admin@gmail.com") {
          navigate("/admin");
        }
      }, [user, navigate]);

    return(
        <>
        <Header/>
        <Outlet/>
        </>
    )
}