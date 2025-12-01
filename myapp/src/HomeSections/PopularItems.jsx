import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PopularItems.css';

function PopularItems() {
  let navigate = useNavigate()
  const [products, setProducts] = useState([]);

  // let [dropwn, setDropwn] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let res = await fetch("http://localhost:5000/displayProducts");
        let data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  let cartHandler = async (prduct) => {
    let token = localStorage.getItem("token")
    console.log("Token in cartHandler:", token)

    if (!token) {

      let cart = JSON.parse(localStorage.getItem("cart")) || []
      let existingProduct = cart.findIndex(item => item.productid === prduct.productid)

      if (existingProduct === -1) {
        cart.push({
          ...prduct,
          quantity: 1,

        })
      } else {
        cart[existingProduct].quantity += 1
      }

      localStorage.setItem("cart", JSON.stringify(cart))
    }
    else {
      // Logged-in user 
      try {
        let response = await fetch("http://localhost:5000/addtoCart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": ` Bearer ${token}`
          },
          body: JSON.stringify([{
            productid: prduct.productid,
            pname: prduct.pname,
            price: prduct.price,
            quantity: 1,
            // imgpath: images[0]?.imgpath || prduct.imgpath
          }])
        })

        let result = await response.json()
        console.log("Cart API response:", result)
      } catch (err) {
        console.error("Error adding to DB cart:", err)
      }
    }

    navigate("/Cart")
  }

  let getctgryData = async () => {
    let response = await fetch("http://localhost:5000/catgryList")
    let result = await response.json()

    // setDropwn(result)
  }
  useEffect(() => {
    getctgryData()

  }, [])

  let displayProducts = (pid) => {
    navigate('/ViewProduct',
      { state: { productid: pid } })
  }
  return (
     <div className="popular-items py-5">
      <div className="container">
        <h2 className="section-title text-center mb-5">Popular Items</h2>
        <div className="row justify-content-center g-4">
          {products.map((item) => (
            <div className="col-6 col-md-4 col-lg-2" key={item.productid}>
              <div className="product-card text-center">
                <img
                  src={`http://localhost:5000/uploads/${item.imgpath}`}
                  alt={item.pname}
                  className="product-img mb-3"
                />
                <h6 className="fw-bold">{item.pname}</h6>
                <p className="text-muted">₹{item.price}</p>
                <button className="btn btn-dark btn-sm mt-2" onClick={() => displayProducts(item.productid)}>More Details</button>
                <button className="btn btn-dark btn-sm mt-2" onClick={() => cartHandler(item)}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PopularItems;
