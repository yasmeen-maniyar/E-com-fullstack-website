import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Adminusers() {
    const [users, setUsers] = useState([])
    const [rowid, setRowid] = useState(0)
    const [txtboxval, settxtbxval] = useState({ fname: "", emailid: "" })


    const navigate = useNavigate()
    let token = localStorage.getItem("token")
    let role = localStorage.getItem("role")


    let allUsers = async () => {
        let response = await fetch("http://localhost:5000/admin/users", {
            headers: {
                'Authorization':` Bearer ${token}`
            },
        })
        let result = await response.json()
        setUsers(result)
    }
    useEffect(() => {
        if (token == null || role != "admin") {
            navigate('/Login')
            return
        }
        allUsers()

    }, [])

    let getDataHandler = (e) => {
        // console.log(e.target.value)
        //  console.log(e.target.name)

        let { name, value } = e.target;
        settxtbxval((existingdata) =>
            ({ ...existingdata, [name]: value }))
    }

    let deleteHandler = async (id) => {
        let response = await fetch(`http://localhost:5000/admin/users/${id}`, {
            method: "delete",
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
        let result = await response.json()
        if (response.status == 200) {
            alert(result.message)
            settxtbxval(result)
        }
    }

    let editHandler = (users) => {
        setRowid(users.id)
        settxtbxval(users)
    }

    // app.put('/UpdateUser/:id',(req,res)=>{

    let saveHandler = async () => {
        let response = await fetch(`http://localhost:5000/admin/users/${rowid}`, {
            method: 'put',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(txtboxval)
        });
        let result = await response.json();

        if (response.status === 200) {
            alert(result.message);
            allUsers()
        }
    }
    let cancelHandler = () => {
        setRowid(0);
        settxtbxval({ fname: "", emailid: "" });
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Registered Users</h2>
            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>slno</th>
                        <th>First Name</th>
                        <th>Email</th>
                        <th>Delete</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((u, index) => (
                            <tr key={u.id}>
                                <td>{index + 1}</td>
                                <td>{rowid === u.id ? <><input onChange={getDataHandler} type='text' value={txtboxval.fname} name='fname' id='' /></> : u.fname}</td>
                                <td>{rowid === u.id ? <><input onChange={getDataHandler} type='text' value={txtboxval.emailid} name='emailid' id='' /></> : u.emailid}</td>
                                <td><button onClick={() => deleteHandler(u.id)}>Delete</button></td>
                                <td>{rowid === u.id ? <><button onClick={saveHandler} >Save</button> <button onClick={cancelHandler}>Cancel</button></> : <button onClick={() => editHandler(u)}>Edit</button>}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">No users found</td>
                        </tr>
                    )}
                </tbody>
            </table >
        </div >
    )
}

export default Adminusers