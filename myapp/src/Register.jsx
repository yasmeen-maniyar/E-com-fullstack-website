import React, { useState, useEffect } from 'react';
import Citylist from './components/Citylist';
import Verifyotp from './components/Verifyotp';

function Register() {
  let [txtbxval, settxtbxval] = useState({ fname: "", lname: "", emailid: "",password: "", mobile: "", cityid: "" })
  let [otpform, setotpform] = useState(false)
  let [timer, setTimer] = useState(120)
  let [disableresendbutton, setisableresendbutton] = useState(true)


  const fields = [
    { label: "First Name", name: "fname", type: "text", placeholder: "Enter your first name" },
    { label: "Last Name", name: "lname", type: "text", placeholder: "Enter your last name" },
    { label: "Email ID", name: "emailid", type: "email", placeholder: "Enter your email" },
    { label: "Password", name: "password", type: "password", placeholder: "Enter your password" },
    { label: "Mobile Number", name: "mobile", type: "text", placeholder: "Enter your mobile number" }];

  let textbxHandler = (e) => {
    let { name, value } = e.target;
    settxtbxval({ ...txtbxval, [name]: value })
  }


  let getCitylist = (cityid) => {
    settxtbxval((prevdata) => ({ ...prevdata, cityid: cityid }))
    // console.log(cityid);

  }

  let submitHandler = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:5000/Signup`, {
        method: "post",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(txtbxval)
      });

      let result = await response.json()
      if (response.status === 200) {
        alert(result.message)
        setotpform(true)
        startTimer()
      }
      else if (response.status === 400) {
        alert(result.message)
      }

    }

    catch (err) {
      alert("An error accured.please try again")
      console.log(err)
    }
  }

  let startTimer = () => {
    setisableresendbutton(true)
    setTimer(120)
    let interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setisableresendbutton(false)
          return 0;
        }
        return prev - 1;
      })
    }, 1000);
  }



  // console.log(txtbxval)
  return (
    <>
      {
        !otpform ?
          <div className="container col-lg-6 mx-auto mt-5">
            <div className="p-5 bg-white rounded-4 shadow">
              <h2 className="text-center mb-4 text-primary">Register</h2>
              <form onSubmit={submitHandler}>
                {fields.map((field) => (
                  <div className="mb-3" key={field.name}>
                    <label htmlFor={field.name} className="form-label">{field.label}</label>
                    <input
                      onChange={textbxHandler}
                      type={field.type}
                      className="form-control"
                      name={field.name}
                      id={field.name}
                      placeholder={field.placeholder}
                      required
                    />
                  </div>
                ))}
                <div className="col-lg-12">
                  <Citylist getCitylist={getCitylist}></Citylist>
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Create Account
                </button>
              </form>
            </div>
          </div> :
          <Verifyotp timer={timer} emailid={txtbxval.emailid} submitHandler={submitHandler} disableresendbutton={disableresendbutton} ></Verifyotp>
      }
    </>
  );

}
export default Register;
