import React, { useState, useEffect } from "react";

function Adminpurchase() {
  const [admin, setAdminp] = useState([])
  const [status, setStatus] = useState({})

  const getPurchase = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/adminpurchases", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    setAdminp(result)
  }

  const handlerchange = async (orderid) => {
    const token = localStorage.getItem("token")
    const response = await fetch(`http://localhost:5000/status/${orderid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: status }),
    })

    if (!response.ok) {
      const data = await response.json();
      console.error("Error updating status:", data)

      alert(data.message)
    } else {
      console.log("Status updated successfully")
      getPurchase()
    }
  }
  console.log(status)

  useEffect(() => {
    getPurchase();
  }, []);

  return (
    <>
      <h1 className="text-center text-uppercase text-warning fw-bold">
        Admin Purchase
      </h1>
      <hr />
      <div className="container">
        <div className="row">
          {admin.map((purchases) => (
            <div key={purchases.orderid} className="col-lg-4 mt-5">
              <div className="card" style={{ height: "45vh", width: "50vh" }}>
                <div className="card-body">
                  <h5 className="card-title">Order ID: {purchases.orderid}</h5>
                  <h5 className="card-title">Username: {purchases.fname}</h5>
                  <h6 className="card-title">Quantity: {purchases.quantity}</h6>
                  <h6 className="card-title">
                    Status: {purchases.status}
                  </h6>
                  <h5 className="card-text">
                    Total Amt: {purchases.totalamt}
                  </h5>
                </div>


                <select onChange={(e) => setStatus(e.target.value)} className="form-select" >
                  <option value="">---select---</option>
                  <option value={0}>Pending</option>
                  <option value={1}>Packed</option>
                  <option value={2}>Shipped</option>
                  <option value={3}>Delivered</option>
                </select>


                <button className="btn btn-primary mt-2" onClick={() => handlerchange(purchases.orderid)}> Submit </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Adminpurchase;