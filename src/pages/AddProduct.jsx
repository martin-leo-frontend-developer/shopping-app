
import { Form, Row, Col, Button } from "react-bootstrap";
import { db, storage } from "../components/config";
import { useEffect, useRef } from "react";
import { Form as RouterForm, useActionData, useNavigation } from "react-router-dom";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";


export async function action({ request }){
    const formData = await request.formData()
    const productProfile = formData.get("productProfile")
    const productName = formData.get("productName")
    const productPrice = formData.get("productPrice")

     // Check if the uploaded file is an image
     if (productProfile && productProfile.type.startsWith("image/")) {
        if(productName.length > 3 && productName.length < 31){
            if(productPrice > 99 && productPrice < 1000001){
                try{
                    const storageRef = await ref(storage, `images/${uuidv4()}`)
                    const uploadRef = await uploadBytes(storageRef, productProfile)
                    const imageUrl = await getDownloadURL(uploadRef.ref)

                    const productCollection = collection(db, "products")
                    await addDoc(productCollection, {imageUrl: imageUrl, name: productName, price: productPrice}) 
                    
                    toast.success("Product successfully added!!!.")
                    return { formClear: true}
                    
                }catch(error){
                    toast.error(error.message, {position: "top-left"})
                    return {formClear: false}
                }

            }else{
                toast.error("Invalid product price. Please price should be between 100 and 1000000", {position: "top-left"})
            }

        }else{
            toast.error("Invalid product name length.", {position: "top-left"})
        }
            
    } else {
        toast.error("Invalid file type. Please upload an image.", {position: "top-left"});
        
    }

    

    return null
}



export default function AddProduct(){
    const navigation = useNavigation()


    const formRef = useRef(null)

    const actionData = useActionData()


    //resetting the form
    useEffect(() => {
        if(actionData?.formClear && formRef.current){
            return formRef.current.reset()
        }

    },[actionData])
    return(
        <>
        <h2 className="text-center bg-success text-light py-2">Add Product</h2>
        <RouterForm method="post"  encType="multipart/form-data" className="py-4" ref={formRef}>
            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Product Image</Form.Label>
                <Form.Control type="file" name="productProfile" accept="image/*" disabled={navigation.state === "submitting"} required/>
            </Form.Group>
            <Row className="mb-3">
                <Form.Group as={Col} sm={6} controlId="formGridEmail">
                    <Form.Label>Product name</Form.Label>
                    <Form.Control type="text" name="productName" minLength={3} maxLength={30} placeholder="Enter product name" readOnly={navigation.state === "submitting"} required/>
                </Form.Group>

                <Form.Group as={Col} sm={6} controlId="formGridPassword">
                    <Form.Label>Product Price</Form.Label>
                    <Form.Control type="number" name="productPrice" min={100} max={1000000} placeholder="Enter product price" readOnly={navigation.state === "submitting"} required/>
                </Form.Group>
            </Row>
            <Button variant="primary" type="submit" disabled={navigation.state === "submitting"}>
                {navigation.state === "submitting" ? "Adding..." : "Add Product"}
            </Button>
            
        </RouterForm>

        </>

    )
}