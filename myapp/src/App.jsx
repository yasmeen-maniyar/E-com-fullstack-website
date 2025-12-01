import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './Register'
import Home from './Home'
import Navbar from './components/Navbar'
import Citylist from './components/Citylist'
import Addproduct from './components/Addproduct'
import Login from './Login'
import Admin from './components/Admin'
import Logout from './components/Logout'
import Products from './Products'
import ViewProduct from './components/ViewProduct'
import Cart from './Cart';
import Purchase from './components/Purchase'
import AdminCategory from './components/Admincategory'
import Adminusers from './components/Adminusers'
import Adminpurchase from './components/Adminpurchase'

function App() {

  const [role, setrole] = useState(localStorage.getItem("role"))

  const updateRole = (role) => {
    setrole(role)
    if (role) {
      localStorage.setItem("role", role)
    }
    else {
      localStorage.removeItem("role")
    }
  }

  return (
    // <div className="container mt-5">
    //   <Citylist></Citylist>
    // </div>

    <Router>
      <Navbar role={role}></Navbar>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/Register' element={<Register />}></Route>
        <Route path='/Products' element={<Products />}></Route>
        <Route path='/Login' element={<Login updateRole={updateRole} />}></Route>
        <Route path='/AdminLogin' element={<Admin updateRole={updateRole} />}></Route>
        <Route path='/Addproduct' element={<Addproduct />}></Route>
        <Route path='/ViewProduct' element={<ViewProduct />}></Route>
        <Route path='/Cart' element={<Cart />}></Route>
        <Route path='/Purchase' element={<Purchase />}></Route>
        <Route path='/AdminCategory' element={<AdminCategory />}></Route>
        <Route path='/Adminusers' element={<Adminusers />}></Route>
        <Route path='/Adminpurchase' element={<Adminpurchase />}></Route>
        <Route path='/Logout' element={<Logout updateRole={updateRole} />}></Route>
      </Routes>
    </Router>
  )
}

export default App
