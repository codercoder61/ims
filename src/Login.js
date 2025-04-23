import React, { useState , useEffect} from 'react'
import "./Login.css"
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
      });
      useEffect(() => {
        localStorage.setItem('role', ""); // Save the theme in localStorage
        localStorage.setItem('username', ""); // Save the theme in localStorage
        }, []);
      const [responseMessage, setResponseMessage] = useState('');
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
      
        // Send the data to the PHP script as JSON
        fetch('https://soc-net.info/api/HandleLogin.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',  // Set content type to JSON
          },
          body: JSON.stringify(formData),  // Send data as a JSON string
        })
        .then(response => response.json())
        .then(data => {
          // Handle response (you can navigate or display the message)
          if(data.message == "Logged in successfully")
          {
            //console.log(11)
            navigate('/dashboard', { state: {
              role : data.role,
              username : data.username
            } });
          }else if(data.status=="adduser"){
            localStorage.setItem('role', "adduser"); // Save the theme in localStorage
            navigate('/addUser');
          }
          else{
          setResponseMessage('Invalid username or password.');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          setResponseMessage('There was an error submitting the form.');
        });
      };
      
  return (
    <div id="body">
    <div id="panel">
      <h1 style={{textAlign:'center'}}>Login Panel</h1>
      <h4 style={{textAlign:'center',marginBottom:'10px'}}>Inventory Management System</h4>
      <form onSubmit={handleSubmit} action="" method="POST">
        <label>Username</label><br/>
        <input id="username" value={formData.username} onChange={handleChange} type="text" placeholder="Username" name="username"/><br/>
        <label>Password</label><br/>
        <input id="password" value={formData.password} onChange={handleChange} type="password" placeholder="Password" name="password"/><br/>
        
        <input type="submit" value="Login"/>
      </form>
      {responseMessage && <p style={{marginTop:"10px"}}>{responseMessage}</p>}
    </div>
    </div>
  )
}

export default Login
