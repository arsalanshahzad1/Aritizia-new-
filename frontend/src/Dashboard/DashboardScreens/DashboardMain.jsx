import React from 'react'
import Sidebar from './Sidebar'
import DashboardArea from './DashboardArea'
import './Dashboard.css'
import { useContext } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'


function DashboardMain({ search, setSearch }) {
    const { sidebarCollapsed } = useContext(GlobalContext)
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