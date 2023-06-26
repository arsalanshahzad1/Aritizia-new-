import React from 'react'
import DashboardFront from './DashboardFront'
import { Routes, Route } from 'react-router-dom'
import UserManagement from './UserManagement'
import User from './User'
import ControllingContent from './ControllingContent'
import User2 from './User2'
import AnalyticsTool from './AnalyticsTool'
function DashboardArea({ search, setSearch }) {
    return (
        <div className='pos-rel'>
            <Routes>
                <Route path='/' element={
                    <DashboardFront search={search} setSearch={setSearch} />

                } />
                <Route path='/user-management' element={
                    <UserManagement search={search} setSearch={setSearch} />

                } />
                <Route path='/user-management/:id' element={
                    <User search={search} setSearch={setSearch} />

                } />
                <Route path='/control-content' element={
                    <ControllingContent />

                } />
                <Route path='/controlling-content/:id' element={
                    <User2 />

                } />
                <Route path='/artwork-management' element={
                    <div>artwork-management</div>

                } />
                <Route path='/analytic-tool' element={
                    <AnalyticsTool />

                } />
            </Routes>

        </div>
    )
}

export default DashboardArea