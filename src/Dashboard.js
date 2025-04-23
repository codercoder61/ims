import React,{useEffect,useState} from 'react'
import Menu from './Menu';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './Dashboard.css'
function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state;
    const [dat, setDat] = useState(null);
  
    useEffect(() => {
        if(!localStorage.getItem('username')){
          navigate('/');
        }
    }, []);
    if(data)
    {
        localStorage.setItem('role', data.role); // Save the theme in localStorage
        localStorage.setItem('username', data.username); // Save the theme in localStorage
    }

    useEffect(() => {
            
        
            fetch('http://soc-net.info/api/Dashboard.php')
            .then((response) => {
                // Check if the response is okay
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
        
                return response.json(); // This will fail if the response is not valid JSON
            })
            .then((data) => {
                console.log(data);
                setDat(data); // Store data from the API
                
            })
            .catch((error) => {
                // Handle errors (invalid JSON, network issues, etc.)
                console.error('Error:', error);
            });
        }, []); // Empty array ensures this only runs once (componentDidMount)
        
  return (
    <>
      <Menu/>
      <div style={{backgroundColor:"#f0f2f6"}}>
        <div id="dash" style={{display:'flex'}}>
          <div>{dat && dat.num_users} Users</div>
          <div>{dat && dat.num_categories} Categories</div>
          <div>{dat && dat.num_products} Products</div>
          <div>{dat && dat.total_sales}DH Sales</div>
        </div>
        <div id="dash2" style={{display:"flex",justifyContent:'space-between'}}>
          <div>
            <p>Latest Sales</p>
            <table>
              <thead>
              <tr>
                <td>#</td>
                <td>Product Name</td>
                <td>Date</td>
                <td>Total Sale</td>
              </tr>
              </thead>
              <tbody>
              {dat && dat.sales.map((product, index) => (
  <tr key={index}><td>{product.id}</td> <td>{product.name}</td> <td>{product.date}</td><td>{product.total} DH</td></tr>
))}
</tbody>

            </table>
          </div>
          <div>
          <p>Recently Added Products</p>
          {dat && dat.products.map((product, index) => (
            <p key={index}><span>{product.title}</span> - <span>{product.price} DH</span> - <span>{product.category}</span></p>
          ))}
          </div>
        </div>
        </div>
    </>
  )
}

export default Dashboard
