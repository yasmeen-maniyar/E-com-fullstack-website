import React from 'react'
import style from '../Components/Citydrop.module.css'
import { useEffect } from 'react'
import { useState } from 'react'

function Citylist({getCitylist}) {

    let [citys, setcitys] = useState([])
    let [search, setSearch] = useState("")
    let [filterData, setfilterData] = useState([])

    let getCityData = async () => {
        let response = await fetch("http://localhost:5000/citydata")
        let result = await response.json()
        setcitys(result)
        console.log(result)
    }

    useEffect(() => {
        getCityData()

    }, [])

    let searchcityHandler = (e) => {
        let val = e.target.value
        setSearch(val)
        setfilterData(val ? citys.filter((data) => data.city_name.toLowerCase().startsWith(val.toLowerCase())) : [])
    }
    //console.log(citys)
    console.log(filterData)

    let cityHandler=(city)=>{
        setSearch(city.city_name)
        setfilterData([])
        if(getCitylist){
             getCitylist(city.cityid)
        }
       
    }
    return (
        <div className='col-lg-12 mt-3'>

        
                <input type="text" value={search} className='form-control txtbx form-control-lg rounded-3' onChange={searchcityHandler} placeholder='search...' name='' />

                <ul className={style.ulstyle}>
                {
                    filterData.map(city => <>
                        <li onClick={()=>cityHandler(city)}>{city.city_name}</li>

                    </>)
                }
            </ul>
       
   </div>
  )
}

export default Citylist