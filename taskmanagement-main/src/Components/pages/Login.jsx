import React, { useState } from 'react'
import './LoginSignUp.css'
import pass_icon from '../Assets/password.png'
import email_icon from '../Assets/email.png'
import { auth,db } from '../../firebase'
import { useNavigate, Link} from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate();
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
   
    const handleLogin = async (e)=> {
        e.preventDefault();
        try{
        
            const userCredentials = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredentials.user;
            console.log(user.uid);
            // Fetching the user type from Firestore
            const userDoc = await db.collection('users').doc(user.uid).get();
            const userType = userDoc.data().type;

            // Redirecting based on the user type
            if (userType === 1) {
                navigate('/AdminDash');
                
            } else if (userType === 2) {
                navigate('/employeedash');
                
            }
        }
        catch(error){
            console.log(error);
            alert(error);
        }

       
    }
    
  return (
    
    <form onSubmit={handleLogin}>
        <div className='Links-container'>
   <Link to="/" className='Link'>Login</Link>
    <Link to={"/SignUp"} className='Link'>SignUp</Link>
   </div>
   <div className="container">
        <div className="header">
            <div className="text">Login</div>
            <div className="underline"></div>
        </div>
        <div className="inputs">
            <div className="input">
                <img src={email_icon} alt="email"/>
                <input type="email" placeholder='E-mail' value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="input">
                <img src={pass_icon} alt="pass"/>
                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
           </div>
            <div className="submit-container">
            <button type='submit' className='submit-button'>Submit</button>
            </div>
        </div>
    </div>
    </form>
  )
}
export default Login;