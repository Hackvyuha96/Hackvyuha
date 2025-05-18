import './Dash.css';
import { db,auth} from '../../firebase';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';

function UserPage() {
  const navigate = useNavigate();
  const [error,setError] = useState('');
  const [taskList,setTaskList] = useState([]);
  const [percent,setPercent] = useState('0');
  const [review,setReview] = useState("Your Review");
  const [currentTaskId,setCurrentTaskId] = useState('');
  const [assigneeName,setAssigneeName] = useState('');
  const [emploName,setEmploName] = useState('');
  //Fetch the previously added tasks and display
 const fetchTaskList = async() =>{
  try {
    const tasksSnapshot = await db.collection('tasks').get();
    const fetchedTasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(),createdAt: doc.data().createdAt.toDate().toString() }));
    setTaskList(fetchedTasks);
  } catch (error) {
    console.error('Error fetching tasks: ', error);
  }
};

//logic for fetching username
const fetchCurrUserName = async()=>{
  const currentUser = auth.currentUser;
  const userDoc = await db.collection('users').doc(currentUser.uid).get();
  const CurrentUserName = userDoc.data().username;
  setEmploName(CurrentUserName);
}
useEffect(()=>{
  fetchCurrUserName();
  fetchTaskList();
})
//logic for update progress
const handleProgressUpdate = async (e)=>{
  e.preventDefault();
  if (emploName!==assigneeName) {
    setError("Can't access other's Tasks");
    alert(error,"Can't access other's Tasks");
    setPercent('0');
    setReview("Your Review");
    setCurrentTaskId('');
  }
  else{
    await db.collection('tasks').doc(currentTaskId).update(
      {
        progress: percent,
        progressReview: review,
      }
    );
    setPercent('0');
    setReview("Your Review");
    setCurrentTaskId('');
    alert("Updated successfully");
    fetchTaskList();
  }
}
 //logic for logout module
 const handleLogout= async (e)=> {
  e.preventDefault();
  try {
    await auth.signOut();
    navigate("/");
  } catch (error) {
    console.log(error);
    alert(error);
  }
};
 
  return (
    <div>
    <div className="appBar">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <Typography id='typog' variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Employee Portal <div className="empName">Hi,{emploName}</div>
            </Typography>
            <Button id='logoutbutton' onClick={handleLogout} color="inherit">Log-out</Button>
          </Toolbar>
        </AppBar>
      </Box>
      </div>
        <div className="showTaskList">
        <h2>Assigned Task List</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {taskList.length===0?<p>No tasks to show</p>:(<List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <ListItem alignItems="flex-start">
        <ListItemText><ul>
            {taskList.map(tasks => (
                <li key={tasks.id}>
                      <strong>Task:</strong> {tasks.task} <br />
                      <strong>Assignee:</strong> {tasks.assignee} <br />
                      <strong>Progress:</strong> {tasks.progress}%<br />
                      <strong>Date-Assigned:</strong> {tasks.createdAt} <br />
                      <form onSubmit={handleProgressUpdate}>
                      <Box sx={{ width: 300 }}>
                          <Slider value={percent} onChange={(e)=>setPercent(e.target.value)} aria-label="Default" valueLabelDisplay="auto" color="secondary"/>
                      </Box>
                      <Box
                      component="form"
                      sx={{
                      '& .MuiTextField-root': { m: 1, width: '25ch' },
                      }}
                      noValidate
                      autoComplete="off"
                      >
                     <TextField
                      id="filled-multiline-static"
                      label="Update Progress"
                      multiline
                      rows={4}
                      value={review}
                      variant="filled"
                      onChange={(e)=>setReview(e.target.value)}
                      />
                      </Box>
                      <Button id='SubmitButton' type="submit" onClick={()=>{setCurrentTaskId(tasks.id);setAssigneeName(tasks.assignee)}}>Proceed</Button>
                      </form>
                      <Divider variant="inset" component="li" />
                </li>
                ))}
        </ul></ListItemText>
        </ListItem></List>)
        }
        </div>
   </div>
  );
}

export default UserPage;