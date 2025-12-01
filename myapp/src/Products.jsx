import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Products() {

    let navigate = useNavigate()

    let [prdcts, setPrdcts] = useState([]);

    let [dropwn, setDropwn] = useState([]);

    let [selector, setselector] = useState('All');

    let [filprdct, setFilprdct] = useState([]);

    const ProductsList = async () => {

        let response = await fetch("http://localhost:5000/displayProducts")
        let result = await response.json();
        console.log(result);
        setPrdcts(result);
        setFilprdct(result);

    };

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

        setDropwn(result)
    }

    useEffect(() => {
        ProductsList()
        getctgryData()

    }, [])

    useEffect(() => {
        applyFilter()
    }, [selector])

    let displayProducts = (pid) => {
        navigate('/ViewProduct',
            { state: { productid: pid } })
    }
    let applyFilter = () => {
        console.log(selector)
        if (selector !== "All") {
            prdcts = prdcts.filter(p => p.categryname === selector)
            setFilprdct(prdcts)
        }
        console.log(prdcts);

    }
    console.log(prdcts);
    return (
        <>
            <div className="container">
                <select onChange={(e) => setselector(e.target.value)} value={selector}>
                    <option>All</option>
                    {

                        dropwn.map((data) => <>
                            <option value={data.categryname}>
                                {data.categryname}
                            </option>
                        </>)
                    }
                </select>
                <div className="row">

                    {
                        filprdct.map((Product) => <>
                            <div className="col-lg-4 mt-5">
                                <div className="card">
                                    <img style={{ height: "50vh" }} src={`http://localhost:5000/uploads/${Product.imgpath}`} className="card-img-top" alt="..."></img>
                                    <div className="card-body">
                                        <h5 className="card-title">{Product.pname}</h5>
                                        <p className="card-text">{Product.price}</p>
                                        {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}

                                        <button className='btn btn-success ms-2 mt-3 d-grid' onClick={() => displayProducts(Product.productid)}>View More</button>
                                        <button className='btn btn-success ms-2 mt-3 d-grid' onClick={() => cartHandler(Product)}>Add To Cart</button>
                                    </div>
                                </div>
                            </div>
                        </>)
                    }
                </div>
            </div>
        </>
    )
}

export default Products