import React, { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';

function Purchase() {
    const [purchase, setPurchase] = useState([]);

    let purchaseProduct = async () => {
        const token = localStorage.getItem("token");
        console.log(token)
        const response = await fetch("http://localhost:5000/purchase", {
            method: "GET",
            headers: {
               
                authorization: `Bearer ${token}`
            },
        });

        let result = await response.json();

        setPurchase(result);
        console.log(purchase)
    };

    useEffect(() => {
        purchaseProduct();
    }, []);

    return (
        <>
            <h2 className='text-bold text-center text-uppercase'>My Orders</h2>
            <div className="container">
                <div className="row">
                    {
                        purchase.map((purchase) => <>
                        {/* // <Card style={{ width: '18rem', marginTop: '10px', background: 'black', color: 'white' }}>
                        //     <Card.Body>
                        //         <Card.Title>{item.orderid}</Card.Title>
                        //         <Card.Title>{item.quantity}</Card.Title>
                        //         <Card.Title>{item.date}</Card.Title>
                        //         <Card.Title>{item.totalamt}</Card.Title>
                        //         <Card.Subtitle className="mb-2">{item.status}</Card.Subtitle>
                        //     </Card.Body>
                        // </Card> */}

                            <div className="col-lg-4 mt-5">
                                <div className="card">
                                    <h5 class="card-title">orderid:{purchase.orderid}</h5>
                                    <h5 class="card-title">Quantity:{purchase.quantity}</h5>
                                    <h5 class="card-title">Date:{purchase.date}</h5>
                                    <h5 class="card-title">TOtalamt:{purchase.totalamt}</h5>
                                    <h5 class="card-title">Status:{purchase.status}</h5>
                                </div>
                            </div>
                        </>
                        )}

                </div>
            </div>
        </>
    );
}

export default Purchase;