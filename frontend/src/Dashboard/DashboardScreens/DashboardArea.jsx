import React from 'react'
import DashboardFront from './DashboardFront'

function DashboardArea({ search, setSearch }) {
    return (
        <div>
            <DashboardFront search={search} setSearch={setSearch} />
        </div>
    )
}

export default DashboardArea