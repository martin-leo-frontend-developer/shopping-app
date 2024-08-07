import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, useNavigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Error from './components/Error';
import NotFound from './components/NotFound';
import SignUp, { action as signUpAction} from './pages/SignUp';
import Login, {action as loginAction} from './pages/Login';
import Admin from './pages/Admin';
import Home, {loader as productsLoader} from './pages/Home';
import AddProduct, { action as addProductAction}  from './pages/AddProduct';
import ViewPurchase from './pages/ViewPurchase';
import { auth } from './components/config';



function ProtectedRoute({children}){

  const navigate = useNavigate() 

  const [user, setUser] = useState(null)

  useEffect(() => {
    // Listener for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user if authenticated
      } else {
        setUser(null); // Set user to null if not authenticated
        navigate("/login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe(); // Clean up the subscription on unmount

}, [navigate]);

return user ? children : null
} 

// index.js or App.js

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}


const router = createBrowserRouter( 
  createRoutesFromElements(
    <>
      <Route path='/' element={<AppLayout/>} errorElement={<Error/>} >
        <Route index element={<Home/>} loader={productsLoader} errorElement={<Error/>}/>
        <Route path='login' element={<Login/>} action={loginAction} errorElement={<Error/>}/>
        <Route path='signup' element={<SignUp/>} action={signUpAction} errorElement={<Error/>}/>
        <Route  element={<ProtectedRoute><Admin/></ProtectedRoute>} errorElement={<Error/>}>
          <Route path='admin' element={<AddProduct/>} action={addProductAction} errorElement={<Error/>}/>
          <Route path='view-purchase' element={<ViewPurchase/>}  errorElement={<Error/>}/>
        </Route>
      </Route>
      <Route path='*' element={<NotFound/>}/>      
    </>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
