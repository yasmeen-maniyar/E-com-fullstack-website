import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import '../assets/Addproduct_css.css'
import { MdCancel } from 'react-icons/md'

function Addproduct() {

    let navigate = useNavigate()

    let [ctgry, setcatgry] = useState([])
    let [images, setimages] = useState([])
    let [Errmsg, setErrmsg] = useState(false)

    let [categoryid, setcatId] = useState("")
    let [pname, setPname] = useState("")
    let [model, setModel] = useState("")
    let [price, setPrice] = useState("")

    let token = localStorage.getItem("token")
    let role = localStorage.getItem("role")
    useEffect(() => {
        if (token == null || role!="admin") {
            navigate('/Login')
            return
        }
    },[])

    let getctgryData = async () => {
        let response = await fetch("http://localhost:5000/catgryList")
        let result = await response.json()

        setcatgry(result)
        console.log(result);
    }


    useEffect(() => {
        getctgryData()
    }, [])



    let fields = [{ type: "text", Placeholder: "Product Name", fn: setPname },
    { type: "text", Placeholder: "Product Model", fn: setModel },
    { type: "number", Placeholder: "Product Price", fn: setPrice },

    ]
    function onDrop(acceptedFiles) {


        if (acceptedFiles.length + images.length > 5) {
            setErrmsg(true)
            return;
        }
        setErrmsg(false)
        let fileUrl = acceptedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }))
        setimages((existingImages) => [...existingImages, ...fileUrl])
    }
    const { getRootProps, getInputProps, } = useDropzone({
        onDrop,
        accept: "Image/*",
        multiple: true

    })

    let imgCancelHandler = (cimg) => {
        let remainingImages = images.filter((_, i) => i != cimg)
        setimages(remainingImages)
    }

    let submitHandler = async () => {
        const formHandler = new FormData()

        formHandler.append("categoryid", categoryid)
        formHandler.append("pname", pname)
        formHandler.append("model", model)
        formHandler.append("price", price)


        images.map((img) => { formHandler.append("images", img.file) }
        )
        let response = await fetch(`http://localhost:5000/addProduct`, {
            method: "post",
            headers:{
                'Authorization': `Bearer ${token}`
            },

            body: formHandler
        });
        let result = await response.json();


    }
    console.log("categoryid", categoryid);
    console.log("pname", pname);
    console.log("Model", model);
    console.log("Price", price);


    return (
        <div className="container">
            <h2 className='text-bold text-center text-uppercase' style={{ color: "green" }}>Add Products</h2>
            <div className="col-lg-6 mx-auto mt-3 p-5 bg-dark " style={{ borderRadius: "20px" }} >
                <div className="col-lg-12 mb-3">
                    <select onChange={(e) => setcatId(e.target.value)} name="" id="" className='form-control'>
                        <option>All</option>
                        {

                            ctgry.map((data) => <>
                                <option value={data.categoryid}>{data.categryname}</option>
                            </>)
                        }
                    </select>

                    {
                        fields.map((field) => <>
                            <div className="col-lg-12 mt-3">
                                <input className='form-control' onChange={(e) => field.fn(e.target.value)} type={field.type} placeholder={field.Placeholder} />
                            </div>
                        </>)
                    }

                    <div className="col-lg-12 mt-3">
                        <textarea className='form-control' placeholder='Description'></textarea>
                    </div>
                    <div className="col-lg-12 mb-3 mt-4">
                        <div {...getRootProps()} className='drag-box'>
                            <input {...getInputProps()} />
                            {
                                <>
                                    <p>Drop the files here ...</p>
                                    <p>Drag 'n' drop some files here, or click to select files</p>
                                </>


                            }
                        </div>
                    </div>
                    <div className="image-thumbnails">
                        {
                            images.map((imgs, index) => (
                                <div className='thumbnail'>


                                    <img src={imgs.preview} alt="" className='thumbnail-image' />
                                    <button className='cancel-btn' onClick={() => imgCancelHandler(index)}>
                                        <MdCancel />
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                    {Errmsg && <><div style={{ color: "white" }}>5 Images Only</div></>}
                </div>
                <div className="mx-auto">
                    <button onClick={submitHandler} type='submit' className='btn btn-success mx-auto d-grid col-lg-4'>
                        Add Product
                    </button>
                </div>
            </div>
        </div>



    )
}

export default Addproduct