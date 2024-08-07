import { Container, Form, Card, Button, Alert, Table} from "react-bootstrap";
import { auth, db, messaging } from "../components/config";
import { getToken, onMessage } from "firebase/messaging";
import { arrayUnion, collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { Await, defer, useLoaderData } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { useNetworkState } from "react-use";
import { toast } from "react-toastify";


async function getProducts(){ 
    const productCollactionRef = collection(db, "products");
    const productSnapShot = await getDocs(productCollactionRef);
    const productDetails = productSnapShot.docs.map((doc) => {
        return {...doc.data(), id: doc.id};
    });
    return productDetails;
}

export async function loader(){
    return defer({ data: getProducts()})
}

export default function Home(){
    const productDeatilsPromise = useLoaderData();

    const networkState = useNetworkState();

    const [user, setUser] = useState(null)

    const [cartItems, setCartItems] = useState([])

    const [totalSum, setTotalSum] = useState(0);

    //getting permission
    async function requestPermission() {
        const permission = await Notification.requestPermission();
      
        if (permission === "granted") {
          console.log("Notification permission granted.");
      
          try {
            const token = await getToken(messaging, {
              vapidKey: "BHgG384Uwh8YPBolJIbVP4D0GwFUP5CeNfjujEZj-ut8Owqlazj6ue1uYKKHTBh46mOxA84ujKT6aZI9pY0rORs"
            });
      
            // Handle foreground messages
            onMessage(messaging, (payload) => {
              console.log('Message received. ', payload);
              // Customize notification display
              alert(`New message: ${payload.notification.body}`);
            });
      
          } catch (error) {
            toast.error("Error getting token:", error.message);
          }
        } else if (permission === "denied") {
          
          return null;
        }
      }
      
      // useEffect for messaging notification
      useEffect(() => {
        return () => requestPermission();
      }, []);

    //useEffect for messaging notification
    useEffect(() => {
        return () => requestPermission()

    },[])

     // Calculate total sum whenever cartItems change
    useEffect(() => {
        const sum = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
        setTotalSum(sum);
    }, [cartItems]);

    useEffect(() => {
        // Listener for authentication state changes
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser.uid); // Set user ID if authenticated
                getCartData(currentUser.uid)
            } else {
                setUser(null); // Set to null if not authenticated               
                
            }
        });

        return () => unsubscribe(); // Properly unsubscribe on unmount
    }, [cartItems]);

    
    async function handleAddCart(event){        
        event.preventDefault();

        //checking if the user is logged in
        if (!user) {
            toast.info("Login first to purchase", { position: "top-center" });
            return;
        }

        const form = event.target; 
        const priceWithSymbol = form.price.value; 
        
        // getting data from form
        const productName = form.productName.value; 
        const quantity = form.quantity.value;         
        const price = parseFloat(priceWithSymbol.replace(/[^0-9.-]+/g, ""));
        const totalPrice = quantity * price

        //creating cart database
        try{
            const cartRef = doc(db, "cart", user);

            // Check if cart document already exists
            const cartDoc = await getDoc(cartRef);
            if (cartDoc.exists()) {
                // Update existing cart with new item
                await updateDoc(cartRef, {
                    items: arrayUnion({
                        productName: productName,
                        quantity: quantity,
                        price: price,
                        totalPrice: totalPrice,
                    }),
                });
            } else {
                // Create a new cart document with the item
                await setDoc(cartRef, {
                    items: [
                        {
                            productName: productName,
                            quantity: quantity,
                            price: price,
                            totalPrice: totalPrice,
                        },
                    ],
                });
            } 

            toast.success("Successfully added to cart", { position: "top-left" });
            form.reset(); // Reset the form to its default state      
        }catch(error){
            toast.error(error.message, {position: "top-left"})
        }
    }

    function renderProducts(products){
        const productElements = products.map((product) => (
            <div key={product.id}>
                <Card className="p-2 card">
                    <Card.Img variant="top" src={product.imageUrl}  
                        style={{ width: '80px', height: '100px', objectFit: 'cover' }}
                        className="align-self-center"
                     />
                    <form className="d-flex flex-column" method="post" onSubmit={handleAddCart}>
                        <Form.Control type="text" name="productName" className="border-0 text-center bg-transparent p-0" value={product.name} disabled/>
                        <Form.Control type="text" name="price" className="border-0 text-center bg-transparent p-0" value={`$ ${product.price}.00`} disabled/>
                        <Form.Control type="number" name="quantity" className="" min="1" max="100" defaultValue={1}  />
                        <Button variant="primary" type="submit" className="my-2 align-self-center justify-content-center">
                            Add to cart
                        </Button>
                        
                    </form>
                </Card>
    
            </div>
        ))

        return productElements;
    }

    /***************** getting cart data  */
    async function getCartData(user){
        try {
            const cartCollectionRef = doc(db, "cart", user);
            const cartSnapshot = await getDoc(cartCollectionRef);
      
            if (cartSnapshot.exists()) {
              const cartData = cartSnapshot.data();
              // Assuming the data is stored in an array format
              setCartItems(cartData.items || []);
            } else {
              setCartItems([]);
            }
          } catch (error) {
            console.error("Error fetching cart data:", error);
            toast.error("Failed to load cart data", { position: "top-left" });
          } 
    }

      // Remove item from cart
        async function handleRemoveFromCart(index) {
            const updatedCart = [...cartItems];
            updatedCart.splice(index, 1);

            try {
            const cartRef = doc(db, "cart", user);
            await updateDoc(cartRef, { items: updatedCart });
            setCartItems(updatedCart);
            toast.success("Item removed successfully", { position: "top-left" });
            } catch (error) {
            toast.error("Error removing item: " + error.message, {
                position: "top-left",
            });
            }
        }

    

    return(
        <div className="home">
            <Container>
                {!networkState.online && (
                    <Alert variant="danger" className="text-center">
                        <strong>Warning:</strong> You are offline. Some features may not be
                        available.
                    </Alert>
                )}
                <h2 className="text-center bg-dark text-light py-2 my-2">Shopping Cart</h2>               
                <div className="product-container py-5">
                    <Suspense fallback={<h2>Loading...</h2>}>
                        <Await resolve={productDeatilsPromise.data}>
                            {(data) => renderProducts(data)}
                        </Await>
                    </Suspense>                                     
                </div>   
                {user && (
                    <>
                <h2 className="text-center bg-dark text-light p-2 ">Order Details</h2> 
                <div className="table-responsive">
                    <Table striped bordered hover variant="light">
                        <thead>
                            <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {cartItems.map((item, index) => (
                            
                            <tr key={index}>
                            <td>{item.productName}</td>
                            <td>{item.quantity}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>${item.totalPrice.toFixed(2)}</td>
                            <td>
                                <Button
                                variant="danger"
                                onClick={() => handleRemoveFromCart(index)}
                                >
                                Remove
                                </Button>
                            </td>
                            </tr>
                            
                        ))}
                        {cartItems.length === 0 && (
                            <tr>
                            <td colSpan="5" className="text-center">
                                No items in cart
                            </td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan="3" className="text-end">
                            Total
                            </td>
                            <td colSpan="2">${totalSum.toFixed(2)}</td>
                        </tr>
                        </tbody>
                    </Table> 
                </div>  </> )}
            </Container>
        </div>
    )
}