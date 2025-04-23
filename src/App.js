import './App.css';
import Login from './Login';
import AddUser from './AddUser';
import AddProduct from './AddProduct';
import Users from './Users';
import Dashboard from './Dashboard';
import EditUser from './EditUser';
import EditCatgory from './EditCategory';
import AddSale from "./AddSale"
import EditProduct from './EditProduct';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Categories from './Categories';
import Products from './Products';
import Sales from './Sales'
import EditSale from './EditSale';
import SalesDates from './SalesDates'
import Report from './Report'
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/addUser" element={<AddUser />} />
          <Route path="/sales_dates" element={<SalesDates />} />
          <Route path="/report" element={<Report />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/editproduct" element={<EditProduct />} />
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/editUser" element={<EditUser />} />
          <Route path="/editCategory" element={<EditCatgory />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
          <Route path="/addSale" element={<AddSale />} />
          <Route path="/editsale" element={<EditSale />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
