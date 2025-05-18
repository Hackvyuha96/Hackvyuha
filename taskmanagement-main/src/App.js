import './App.css';
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Login from './Components/pages/Login';
import SignUp from './Components/pages/SignUp';
import  AdminDash  from './Components/pages/AdminDash'
import EmployeeDash from "./Components/pages/EmployeeDash";
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './Components/PrivateRoute';
import { auth } from './firebase';
import { useEffect } from 'react';
function App() {
  
 //handlebeforeunload useEffect for logout when refreshed or closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      auth.signOut();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    //Authprovider and privateRoute is to protect from unauthenticated users
   <BrowserRouter>
   <AuthProvider> 
   <Routes>
   <Route exact path="/" element={<Login/>}/>
   <Route exact path="/SignUp" element={<SignUp/>}/>
   <Route path='*' Component={<Navigate to={"/"}/>}/>
   <Route element={<PrivateRoute/>}>
      <Route exact path='/admindash' element={<AdminDash/>}/>
      <Route exact path='/employeedash' element={<EmployeeDash/>}/>
   </Route>
   </Routes>
   </AuthProvider>
   </BrowserRouter>
  );
}

export default App;
