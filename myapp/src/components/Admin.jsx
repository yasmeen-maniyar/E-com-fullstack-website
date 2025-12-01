import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Admin({updateRole}) {
    let navigate=useNavigate()

    let [formdata, setFormData] = useState({ emailid: "", password: "" })
    let [error,setError]=useState("");

    let fields = [{ type: "email", name: "emailid", placeholder: "Email" },
    { type: "password", name: "password", placeholder: "Password" }
    ]

   

    let txtbxHandler = (e) => {
        let { name, value } = e.target
        setFormData({ ...formdata, [name]: value })
    }

    let submitHandler = async (e) => {
        e.preventDefault();

        let response = await fetch(`http://localhost:5000/adminlogin`, {
            method: "post",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(formdata)
        });
        let result = await response.json();

        if (response.status != 200) {
            alert(result.message)
        }
        else{
                localStorage.setItem("token",result.token)
                localStorage.setItem("role",result.role)
                updateRole(result.role)
                navigate('/Addproduct')

        }
   
    }

    return (
        <>

            <div className="container">
                <div className="col-lg-6 mx-auto mt-3 p-5 bg-dark" style={{ borderRadius: "20px" }}>
                    <h2 className='text-bold text-center text-uppercase' style={{ color: "green" }}>Signin</h2>

                    <form onSubmit={submitHandler}>
                        {
                            fields.map((info) => <>
                                <div className="col-l-6 mt-3 ">
                                    <input className='form-control' onChange={txtbxHandler} type={info.type} name={info.name} placeholder={info.placeholder}></input>
                                </div>
                            </>)

                        }
                        <input type='submit' className='btn btn-success d-grid col-lg-3 mx-auto mt-4'></input>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Admin
