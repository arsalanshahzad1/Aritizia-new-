import React,{useState, useEffect} from 'react'
import Sidebar from './Sidebar'
import DashboardArea from './DashboardArea'
import './Dashboard.css'
import { useContext } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'


function DashboardMain({ search, setSearch }) {
    const { sidebarCollapsed } = useContext(GlobalContext)

    const [scroll, setScroll] = useState(true)

    useEffect(()=>{
      if(scroll){
        window.scrollTo(0,0)
        setScroll(false)
      }
    },[])

    return (
        <div className='Dashboard-main'>
            <div>
                <Sidebar />
            </div>
            <div className={`Dashboard-area ${sidebarCollapsed ? 'Dashboard-area-expanded' : ""}`}>
                <DashboardArea search={search} setSearch={setSearch} />
            </div>
        </div>
    )
}

export default DashboardMain