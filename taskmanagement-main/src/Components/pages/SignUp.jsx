import React, { useState } from 'react'
import './LoginSignUp.css'
import user_icon from '../Assets/username.png'
import pass_icon from '../Assets/password.png'
import email_icon from '../Assets/email.png'
import { auth,db } from '../../firebase'
import { useNavigate,Link} from 'react-router-dom'


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const SignUp = () => {
    const navigate = useNavigate();
    const [UserName,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');
    const [type, setType] = React.useState('');

  const handleChange = (event) => {
    setType(event.target.value);
  };

    const handleSignUp = async (e)=> {
        e.preventDefault();
        if (!type)
        {
            setError("Please select the type");
            alert(error);
            return;
        }
        const userSnapShot = await db.collection('users').where('username','==',UserName).get();
        if (!userSnapShot.empty) {
          setError("Username Already exist");
          alert(error,"Username Already exist");
        }
        else{
         try{
            const userCredentials = await auth.createUserWithEmailAndPassword(email,password);
            const user = userCredentials.user;
            await db.collection('users').doc(user.uid).set({username:UserName,email: email,type:type});
            alert("Success");
            navigate('/');
         }
         catch (error) {
          console.log(error);
          alert(error);
         }

        }
    }
    
  return (
    <form onSubmit={handleSignUp}>
        <div className='Links-container'>
   <Link to="/" className='Link'>Login</Link>
    <Link to={"/SignUp"} className='Link'>SignUp</Link>
   </div>
   <div className="container">
        <div className="header">
            <div className="text">Sign Up</div>
            <div className="underline"></div>
        </div>
        <div className="inputs">
            <div className="input">
                <img src={user_icon} alt="user"/>
                <input type="text" placeholder='Name' value={UserName} onChange={(e)=> setUsername(e.target.value)}/>
            </div>
            <div className="input">
                <img src={email_icon} alt="email"/>
                <input type="email" placeholder='E-mail' value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="input">
                <img src={pass_icon} alt="pass"/>
                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
           </div>
           <div className="input">
           <FormControl id="formControlCss" variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={type}
          onChange={handleChange}
          label="Age"
        >
          <MenuItem value={1}>Lead</MenuItem>
          <MenuItem value={2}>Employee</MenuItem>
        </Select>
      </FormControl>
           </div>
            <div className="submit-container">
                <button type='submit' className='submit-button'>Submit</button>
            </div>
        </div>
    </div>
    </form>
  )
}
export default SignUp;
