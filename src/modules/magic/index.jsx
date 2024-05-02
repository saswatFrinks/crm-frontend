import axiosInstance from "@/core/request/aixosinstance";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Magic = () => {
    const params = useParams();
    const navigate = useNavigate()

  const makeApiCall = async() => {
   const {data} =  await axiosInstance.get(`magic/${params.id}`)
   console.log(data)
   navigate(data.data.redirect)
  }

  useEffect(()=>{
    makeApiCall()
  }, [])
    return(<></>)
}

export default Magic;