import React, { useState } from 'react'

function Verifyotp({emailid,disableresendbutton,timer,submitHandler,backtoregister}) {
    let [otp, setotpdata] = useState("")


    let otpSubmitHandler = async (e) => {
        e.preventDefault()
        let response = await fetch(`http://localhost:5000/verifyUserotp`, {
            method: "post",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({otp:otp,email:emailid})
        })
        let result = await response.json()
    }
    return (
        <div className='container'>
            <h1 className='text-center text-bold text-uppercase'>Verify OTP</h1>
            <div className="col-lg-6 mx-auto">
                <form onSubmit={otpSubmitHandler} >
                    <div className="col-l-12  mx-auto">
                        <input className='form-control' onChange={(e) => setotpdata(e.target.value)} type="text" name="" value={otp} placeholder="Enter OTP" id="" />
                    </div>
                    <div>
                        <input type="submit" className='btn btn-primary mx-auto d-grid mt-3' />
                    </div>
                    <div>
                        <button className='btn btn-success mx-auto d-grid mt-3' onClick={submitHandler} disabled={disableresendbutton}>{timer} Resend</button>
                    </div>
                     {/* <div>
                        <button className='btn btn-success mx-auto d-grid mt-3' onClick={backtoregister} disabled={disableresendbutton}>Register</button>
                    </div> */}
                </form>

            </div>

        </div>
    )
}

export default Verifyotp