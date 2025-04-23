import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import { useNavigate } from 'react-router-dom';
//import { useLocation } from 'react-router-dom';
import './Users.css';

function Users() {
    const navigate = useNavigate();
    //const location = useLocation();
    const [users, setUsers] = useState([]);
    //const data = location.state;

    useEffect(() => {
        if (!localStorage.getItem('username')) {
            navigate('/');
        }
    }, [navigate]);

    /*if (data) {
        localStorage.setItem('role', data.role); // Save the theme in localStorage
        localStorage.setItem('username', data.username); // Save the theme in localStorage
    }*/
    const deleteUser = (id) => {
        // Send data to PHP via a POST request
        //console.log(id);  // For debugging
    
        fetch('https://soc-net.info/api/deleteUser.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Set content type to JSON
            },
            body: JSON.stringify({ id: id }),  // Send data as a JSON object
    
        })
            .then(response => response.json())  // Assuming your PHP returns a JSON response
            .then(data => {
                console.log(data);  // Handle the response from PHP
                // Optionally reload the page
                window.location.reload(true);  // Force reload from the server
            })
            .catch((error) => {
                console.error('Error:', error);  // Handle any errors
            });
    };
    const editUser = (id) => {
        navigate(`/edituser?id=${id}`);
    };
    useEffect(() => {
        fetch('https://soc-net.info/api/getUsers.php')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setUsers(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <>
            <Menu />
            <div id="users">
                {users && (
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Username</th>
                                <th>User Role</th>
                                <th>Last Login</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.role}</td>
                                        <td>{user.lastLogin}</td>
                                        <td style={{display:'flex',justifyContent:'space-around'}}>
                                            <span onClick={()=>editUser(user.id)}>
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </span>
                                            <span onClick={()=>deleteUser(user.id)}>
                                                <i className="fa-solid fa-trash"></i>
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

export default Users;
