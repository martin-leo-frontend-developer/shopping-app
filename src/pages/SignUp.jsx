import { useEffect, useRef } from "react"
import { Col, Row, Button, Form, Container } from "react-bootstrap"
import { redirect, Form as RouterForm, useActionData, useNavigate, useNavigation } from "react-router-dom"
import { toast } from "react-toastify"
import { auth, db } from "../components/config"
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"


export async function action({ request }){
    const formData = await request.formData()
    const email = formData.get("email")
    const password = formData.get("password")
    const nationalID = formData.get("nationalID")

    const hasLetters = /[a-zA-Z]/.test(nationalID); // Check for letters
    const hasNumbers = /\d/.test(nationalID); // Check for numbers
    const hasSpecialChars = /[^a-zA-Z0-9]/.test(nationalID); // Check for special characters

    if(password.length < 6){
        window.location.reload();      
    }

    if(hasLetters && hasNumbers && !hasSpecialChars){
        try{
            await createUserWithEmailAndPassword(auth, email, password)
            const user = auth.currentUser

            const userDocumentRef = doc(db, "Users", user.uid)

            await setDoc(userDocumentRef, {nationalID: nationalID, email: email})                       
            
            toast.success(`${email} successfully registered. You can now login`, {position: "top-left"})
            return { success : true}

        }catch(error){
            toast.error(error.message, {position: "top-left"})
            return { formClear : false}
        }    
    }

    toast.warn("Ooops!!! Check your  national ID number", {position : "top-left"})
    return { formClear : false }

  
}

export default function SignUp(){

    const formRef = useRef(null)
    const actionData = useActionData()
    const navigation = useNavigation()
    const navigate = useNavigate()


    useEffect(() => {
        if (actionData?.success) {
            // Redirect after successful registration
            navigate("/login", { state: { from: "signup" } });
        }
        if (actionData?.formClear && formRef.current) {
            formRef.current.reset();
        }
    }, [actionData, navigate]);

    return(
        <div className="sign-up">
            <Container className="py-5 d-flex justify-content-center">
                <RouterForm method="post" className="form" ref={formRef}>
                <Row className="mb-3">
                    <Form.Group as={Col} sm={6} controlId="formGridEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" placeholder="Enter email" readOnly={navigation.state === "submitting"} required/>
                    </Form.Group>

                    <Form.Group as={Col} sm={6} controlId="formGridPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" minLength={6} maxLength={10} placeholder="Password" readOnly={navigation.state === "submitting"} required/>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} sm={12} controlId="formGridText">
                        <Form.Label>National ID Number</Form.Label>
                        <Form.Control type="text" name="nationalID" minLength={8} maxLength={8} placeholder="Enter national id number" readOnly={navigation.state === "submitting"} required/>
                    </Form.Group>
                </Row>

                <Button variant="primary" type="submit" disabled={navigation.state === "submitting"}>
                    {navigation.state === "submitting" ? "signing up..." : "sign up"}
                </Button>
                </RouterForm>
            </Container>
        </div>
    )
}