import React, { useEffect } from "react";
import {Navigate, Outlet, useLocation} from "react-router-dom";

const ProtectedRoute = ({isAuth}) => {

    const data = localStorage.getItem("data")
    const userAddress = localStorage.getItem("userAddress")
console.log(data?.is_email,"data?.is_emaildata?.is_emaildata?.is_email")
    const {pathname} = useLocation()
        console.log(userAddress,"userAddressuserAddressuserAddressuserAddress")
      if(isAuth)
      {
        return  userAddress  !== "false" ? <Outlet/> : <Navigate to={`/`} state={{from: pathname}}/>       
      }
      else{
        return  data  !== "false" ? <Outlet/> : <Navigate to={`/`} state={{from: pathname}}/>
        
      }
        
}

export default ProtectedRoute
