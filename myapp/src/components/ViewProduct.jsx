// import React from 'react'
// import { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom'
// import '../assets/ViewPrduct_css.css';

// function ViewProduct() {
//     let location = useLocation()
//     const { state } = location
//     let pid = state.productid
//     // console.log(state)

//     let getProductdata = async () => {
//         let response = await fetch(`http://localhost:5000/productData/${pid}`)
//         let result = await response.json();
//         console.log(result);
//     }

//     let getProductimage = async () => {
//         let response = await fetch(`http://localhost:5000/productImage/${pid}`)
//         let result = await response.json();
//         console.log(result);
//     }

//     useEffect(() => {
//         getProductdata();
//         getProductimage();
//     }, [])

//     return (
//         <div className="container py-5">
//             <div className="row">
//                 <div className="col-lg-6 mb-4">
//                     <div className="card shadow-sm">
//                         <img src={mainImage} alt={product.pname} className="main-image" />
//                     </div>
//                     <div className="d-flex flex-wrap gap-3 mt-3">
//                         {images.map((img, index) => {
//                             const imageUrl = `http://localhost:5000/uploads/${img.imgpath}`;
//                             return (
//                                 <img
//                                     key={index}
//                                     src={imageUrl}
//                                     alt="extra"
//                                     onMouseEnter={() => setMainImage(imageUrl)}
//                                     className={`thumbnail ${mainImage === imageUrl ? "active" : ""}`}
//                                 />
//                             );
//                         })}
//                     </div>
//                 </div>

//                 <div className="col-lg-6">
//                     <h2>{product.pname}</h2>


//                     <p className="text-muted mt-5">
//                         {product.pdesc || "No description available."}
//                     </p>
//                     <h4 className="text-success">₹ {product.price || "N/A"}</h4>

//                     <button className='btn btn-success ms-2 mt-3 rounded-3' onClick={() => cartHandler(product)}>Add to Cart</button>
//                     <button className="btn btn-success ms-2 mt-3 rounded-3">Buy Now</button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ViewProduct



import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import '../assets/ViewPrduct_css.css';
import { useNavigate } from 'react-router-dom';
// import Cart from './Cart';
function Viewproduct() {
    const location = useLocation();
    const { state } = location;
    const pid = state?.productid;

    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([]);
    const [mainImage, setMainImage] = useState("");

    const navigate = useNavigate()

    const getProductData = async () => {
        let response = await fetch(`http://localhost:5000/productData/${pid}`);
        let index = await response.json();
        if (index.length > 0) {
            setProduct(index[0]);
            setMainImage(`http://localhost:5000/uploads/${index[0].imgpath}`);
        }
    };

    const getProductImages = async () => {
        let response = await fetch(`http://localhost:5000/productimage/${pid}`);
        let index = await response.json();
        setImages(index);
        if (index.length > 0 && !mainImage) {
            setMainImage(`http://localhost:5000/uploads/${index[0].imgpath}`);
        }
    };

    useEffect(() => {
        if (pid) {
            getProductData();
            getProductImages();
        }
    }, [pid]);

    if (!product) {
        return <div className="container py-5">Loading product...</div>;
    }

    let token = localStorage.getItem("token")
    console.log(token)

    // let cartHandler = async (prduct) => {
    //     let token = localStorage.getItem("token")
    //     console.log("Token in cartHandler:", token)

    //     if (!token) {
         
    //         let cart = JSON.parse(localStorage.getItem("cart")) || []
    //         let existingProduct = cart.findIndex(item => item.productid === prduct.productid)

    //         if (existingProduct === -1) {
    //             cart.push({
    //                 ...prduct,
    //                 quantity: 1,
    //                 imgpath: images[0]?.imgpath || prduct.imgpath
    //             })
    //         } else {
    //             cart[existingProduct].quantity += 1
    //         }

    //         localStorage.setItem("cart", JSON.stringify(cart))
    //      }
    //      else {
    //         // Logged-in user 
    //         try {
    //             let response = await fetch(`"http://localhost:5000/addToCart"`, {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     "authorization":` Bearer ${token}`
    //                 },
    //                 body: JSON.stringify([{
    //                     productid: prduct.productid,   
    //                     pname: prduct.pname,
    //                     price: prduct.price,         
    //                     quantity: 1,
    //                     imgpath: images[0]?.imgpath || prduct.imgpath
    //                 }])
    //             })

    //             let result = await response.json()
    //             console.log("Cart API response:", result)
    //         } catch (err) {
    //             console.error("Error adding to DB cart:", err)
    //         }
    //     }

    //     navigate("/Cart")
    // }




    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-lg-6 mb-4">
                    <div className="card shadow-sm">
                        <img src={mainImage} alt={product.pname} className="main-image" />
                    </div>
                    <div className="d-flex flex-wrap gap-3 mt-3">
                        {images.map((img, index) => {
                            const imageUrl = `http://localhost:5000/uploads/${img.imgpath}`;
                            return (
                                <img
                                    key={index}
                                    src={imageUrl}
                                    alt="extra"
                                    onMouseEnter={() => setMainImage(imageUrl)}
                                    className={`thumbnail ${mainImage === imageUrl ? "active" : ""}`}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="col-lg-6">
                    <h2>{product.pname}</h2>


                    <p className="text-muted mt-5">
                        {product.pdesc || "No description available."}
                    </p>
                    <h4 className="text-success">₹ {product.price || "N/A"}</h4>

                    {/* <button className='btn btn-success ms-2 mt-3 rounded-3' onClick={() => cartHandler(product)}>Add to Cart</button> */}
                    <button className="btn btn-success ms-2 mt-3 rounded-3">Buy Now</button>
                </div>
            </div>
        </div>
    );
}

export default Viewproduct;