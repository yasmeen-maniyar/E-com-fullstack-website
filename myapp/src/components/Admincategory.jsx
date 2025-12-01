import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminCategory() {
    const [category, setCategory] = useState([])
    const [rowid, setRowid] = useState(0)
    const [categories, setcategoeies] = useState({categryname:""})


    const navigate = useNavigate()
    let token = localStorage.getItem("token")
    let role = localStorage.getItem("role")

    let Categories = async () => {
        let response = await fetch('http://localhost:5000/admin/category', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
        let result = await response.json()
        setCategory(result)
    }
    useEffect(() => {
        if (token == null || role != "admin") {
            navigate('/Login')
            return
        }
        Categories()

    }, [])


    
    let getDataHandler = (e) => {
        // console.log(e.target.value)
        //  console.log(e.target.name)

        let { name, value } = e.target;
        setcategoeies((existingdata) =>
            ({ ...existingdata, [name]: value }))
    }

    
    let deleteHandler = async (id) => {
        let response = await fetch(`http://localhost:5000/admin/category/${id}`, {
            method: "delete",
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
        let result = await response.json()
        if (response.status === 200) {
            alert(result.message)
            setcategoeies(result)
        }
        else{
            alert(result.message)
        }
    }

    
    let editHandler = (product) => {
        setRowid(product.categoryid)
        setcategoeies(product)
    }

    // app.put('/UpdateUser/:id',(req,res)=>{

    let saveHandler = async () => {
        let response = await fetch(`http://localhost:5000/admin/category/${rowid}`, {
            method: 'put',
            headers: {
                "Content-type": "application/json",
                 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(categories)
        });
        let result = await response.json();

        if (response.status === 200) {
            alert(result.message);
            Categories(result)
        }
    }
    let cancelHandler = () => {
        setRowid(0);
        setcategoeies({categryname:"" });
    };
    return (
        <>
         <div className="container mt-5">
                <h2 className="mb-4">Category</h2>
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>slno</th>
                            <th>Category Name</th>
                            <th>Delete</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {category.length > 0 ? (
                            category.map((u, index) => (
                                <tr key={u.categoryid}>
                                    <td>{index + 1}</td>
                                    <td>{rowid === u.categoryid ? <><input onChange={getDataHandler} type='text' value={categories.categryname} name='categryname' id='' /></> : u.categryname}</td>
                                    <td><button onClick={() => deleteHandler(u.categoryid)}>Delete</button></td>
                                    <td>{rowid === u.categoryid ? <><button onClick={saveHandler} >Save</button> <button onClick={cancelHandler}>Cancel</button></> : <button onClick={() => editHandler(u)}>Edit</button>}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">Categories Not found</td>
                            </tr>
                        )}
                    </tbody>
                </table >
            </div >
        </>
    )
}

export default AdminCategory