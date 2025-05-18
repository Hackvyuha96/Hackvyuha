import './Dash.css';
import { db,auth} from '../../firebase';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';

function AdminDash() {
 const navigate = useNavigate();
 const [task, setTask] = useState('');
 const [assignee, setAssignee] = useState('');
 const [error, setError] = useState('');
 const [taskList,setTaskList] = useState([]);
 const [adminName,setAdminName] = useState('');
 //Fetch the previously added tasks and display
 const fetchTaskList = async() =>{
  try {
    const tasksSnapshot = await db.collection('tasks').get();
    const fetchedTasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(),createdAt: doc.data().createdAt.toDate().toString()}));
    setTaskList(fetchedTasks);
  } catch (error) {
    console.error('Error fetching tasks: ', error);
  }
};
//Fetch the admin name
const fetchAdminName = async()=>{
  const currentAdminName = auth.currentUser;
  const userDoc = await db.collection('users').doc(currentAdminName.uid).get();
  const admin = userDoc.data().username;
  setAdminName(admin);
}

useEffect(() => {
  fetchTaskList();
  fetchAdminName();
}, []);
 
 //Task assign logic
 const handleAssignTask = async (e) => {
  e.preventDefault();
  if (!task || !assignee) {
      setError('Both task and assignee are required');
      return;
  }
    const typeSnapShot = await db.collection('users').where('type','==',1).where('username', '==', assignee).get();
    if (!typeSnapShot.empty) {
      setError("Can't Assign to Admin");
      return;
    }
  try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
          setError('User is not authenticated');
          return;
      }
      const userQuerySnapshot = await db.collection('users').where('username', '==',assignee).get();
      if (userQuerySnapshot.empty) {
          setError('username not match');
          return;
      }
      await db.collection('tasks').add({
          task:task,
          assignee:assignee,
          progress: 0,
          createdBy: currentUser.uid,
          createdAt: new Date(),
          progressReview: "No Review yet"
      });
      setTask('');
      setAssignee('');
      setError('');
      alert('Task assigned successfully');
      fetchTaskList();
  } catch (error) {
      console.error('Error adding document: ', error);
      setError('Error assigning task: ' + error.message);
  }
};
//Task delete logic
const handleDeletion = async(taskId) =>{
  try{
    await db.collection('tasks').doc(taskId).delete();
  fetchTaskList();
  alert("Deleted successfully");
  }
  catch(error)
  {
    console.log(error);
    alert(error);
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
    //material UI for app bar
   <div>
    <div className="appBar">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <Typography id='typog' variant="h6" component="div" sx={{ flexGrow: 1 }}>
               Admin Portal <div className="adminName"> Hi,{adminName}</div>
            </Typography>
            <Button id='logoutbutton' onClick={handleLogout} color="inherit">Log-out</Button>
          </Toolbar>
        </AppBar>
      </Box>
      </div>
     
      <div className='TaskAssigningCont'>
            <h2>Assign New Task</h2>
            <form onSubmit={handleAssignTask}>
                <input
                    type="text"
                    placeholder="Task"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
                <input
                    id='AssigneeButton'
                    type="text"
                    placeholder="Assign to (Employee Username)"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                />
                <button type="submit">Assign Task</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
        <div className="showTaskList">
        <h2>Assigned Task List</h2>
        {taskList.length===0?<p>No tasks assigned yet</p>:( <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <ListItem alignItems="flex-start">
        <ListItemText><ul>
            {taskList.map(tasks => (
                <li key={tasks.id}>
                      <strong>Task:</strong> {tasks.task} <br />
                      <strong>Assignee:</strong> {tasks.assignee} <br />
                      <strong>Progress:</strong> {tasks.progress}%<br />
                      <strong>Date-Assigned:</strong> {tasks.createdAt} <br />
                      <strong>Employee's Review:</strong> {tasks.progressReview}<br/>
                      <Button id='deletebutton' onClick={()=>handleDeletion(tasks.id)}>Delete Task</Button>
                      <Divider variant="inset" component="li" />
                </li>
                ))}
        </ul></ListItemText>
        </ListItem></List>)}
       
        </div>
   </div>

  );
}

export default AdminDash;