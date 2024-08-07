import { signInWithEmailAndPassword } from "firebase/auth"
import { useEffect, useRef } from "react"
import { Col, Row, Button, Form, Container } from "react-bootstrap"
import { redirect, Form as RouterForm, useActionData, useNavigation } from "react-router-dom"
import { toast } from "react-toastify"
import { auth } from "../components/config"


export async function action({ request }){
    const formData = await request.formData()
    const email = formData.get("email")
    const password = formData.get("password")

    if(email === "admin@gmail.com"){
        try{
            await signInWithEmailAndPassword(auth, email, password)
            toast.success("You now add products!!!", {position: "top-left"})
            return redirect("/admin")
    
        }catch(error){
            toast.error(error.message, {position: "top-left"})
            return { formClear: false}
        }
    }else{

        try{
            await signInWithEmailAndPassword(auth, email, password)
            toast.success("You can now shop!!!", {position: "top-left"})
            return redirect("/")
    
        }catch(error){
            toast.error(error.message, {position: "top-left"})
            return { formClear: false}
        }
    }
    

  
}

export default function Login(){

    const formRef = useRef(null)
    const actionData = useActionData()
    const navigation = useNavigation()


    useEffect(() => {
        if(actionData?.formClear && formRef.current){
            formRef.current.reset()
        }
    }, [actionData])

    return(
        <div className="login">
            <Container className="py-5 d-flex justify-content-center">
                <RouterForm method="post" className="form" ref={formRef}>
                <Row className="mb-3">
                    <Form.Group as={Col} sm={12} controlId="formGridEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" placeholder="Enter email" readOnly={navigation.state === "submitting"} required/>
                    </Form.Group>

                    <Form.Group as={Col} sm={12} controlId="formGridPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" minLength={6} maxLength={10} placeholder="Password" readOnly={navigation.state === "submitting"} required/>
                    </Form.Group>
                </Row>

                <Button variant="primary" type="submit" disabled={navigation.state === "submitting"}>
                    {navigation.state === "submitting" ? "Logging..." : "Login"}
                </Button>
                </RouterForm>
            </Container>
        </div>
    )
}