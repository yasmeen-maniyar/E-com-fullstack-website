import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { useNavigate } from 'react-router-dom';
function Cart() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            //  Logged-in
            fetch("http://localhost:5000/cartProducts", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("Cart from DB:", data);
                    setCart(data);
                    setLoading(false);

                })
                .catch((err) => {
                    console.error("Error fetching cart:", err);

                });
        } else {
            //  Guest user → fetch from localStorage
            let storedCart = JSON.parse(localStorage.getItem("cart")) || [];
            console.log("Cart from localStorage:", storedCart);
            setCart(storedCart);
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <h4 className="text-center mt-4">No Items in Cart</h4>;
    }

    const purchase = async () => {
        const subtotal = cart.reduce(
            (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
            0
        )
        console.log("subtotal:", subtotal)
        const gst = subtotal * 0.18
        const total = subtotal + gst

        const orderData = {

            quantity: cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
            date: new Date().toISOString().slice(0, 10),
            totalamt: total,
            cartitems: cart,
        }
        let token = localStorage.getItem("token")
        const response = await fetch("http://localhost:5000/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: ` Bearer ${token}`
            },
            body: JSON.stringify(orderData),
        })
        console.log(orderData)
        const result = await response.json()
        alert(result.message)
        navigate("/purchase")
    }

    // const purchase = async () => {
    //      const token = localStorage.getItem("token"); 
    //     const subtotal = cart.reduce(
    //         (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    //         0
    //     );
    //     const gst = subtotal * 0.18;
    //     const total = subtotal + gst;

    //     const orderData = {
    //         // userid: 1,
    //         quantity: cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
    //         date: new Date().toISOString().slice(0, 10),
    //         totalamt: total,
    //         cartItems: cart,
    //     };

    //     try {
    //         const response = await fetch("http://localhost:5000/order", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${token}`,
    //             },

    //             body: JSON.stringify(orderData),
    //         });

    //         const result = await response.json();
    //         alert(result.message);
    //     } catch (err) {
    //         console.error("Order failed:", err);
    //     }
    // };

    const subtotal = cart.reduce(
        (amount, curr) => amount + curr.price * curr.quantity,
        0
    );
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;


    return (
        <div className="container mt-2">
            <h2 className="text-center fw-bold">My Cart</h2>

            {cart.length === 0 ? (
                <h4 className="text-center mt-4">Your Cart is Empty</h4>
            ) : (
                <>

                    {cart.map((item, index) => (
                        <div className="col-lg-4" key={index}>
                            <Card
                                style={{ width: "18rem", margin: "12px", border: "none", }}
                           >
                                <Card.Img
                                    src={`http://localhost:5000/uploads/${item.imgpath}`}
                                    style={{
                                        height: "250px",
                                        objectFit: "cover",
                                        padding: "5px",
                                    }}
                                    alt={item.pname}
                                />

                                <Card.Body>
                                    <Card.Title>{item.pname}</Card.Title>
                                    <Card.Text>₹ {item.price}</Card.Text>
                                    <p className="card-text">Quantity: {item.quantity}</p>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}

                    <div>
                        <Card
                            style={{
                                width: "18rem",
                                marginLeft: "800px",
                                height: "250px",
                            }}
                        >
                            <Card.Body className="mt-4 ">
                                <Card.Subtitle
                                    className="mb-2"
                                    style={{ color: "darkblue", fontSize: "1.3rem" }}
                                >
                                    Payment Info.
                                </Card.Subtitle>
                                <Card.Text>Subtotal: ₹ {subtotal}</Card.Text>
                                <Card.Text>GST (18%): ₹ {gst}</Card.Text>
                                <hr></hr>
                                <Card.Text className="fw-bold">Total: ₹ {total}</Card.Text>
                                <button className="btn btn-success col-lg-12 " onClick={() => purchase()}>Purchase</button>
                            </Card.Body>

                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;




