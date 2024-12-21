import { MedicalServicesOutlined, PersonOutlineOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import './dashboard.css';
import ChartsDashboard from './ChartsDashboard';

const Dashboard = () => {

    const apiUrl = process.env.REACT_APP_API_URL;
    const [clientCount, setclientCount] = useState('')
    const [emailCount, setemailCount] = useState('')
    
    
    useEffect(() => {
        fetch(`${apiUrl}/getCountsintheProject`)
            .then(response => response.json())
            .then(data => {
                setclientCount(data.clientsCount)
                setemailCount(data.emailCount)
            }).catch(err => {

            })
    }, [])
   
    return (
        <>
            <div className='dashboard'>
                <div className="head-title">
                    <div className="sesstion-header-name">
                        <h2>Dashboard</h2>
                    </div>
                </div>
                <ul className="box-info">
                    <li>
                        <PersonOutlineOutlined className='bx' />
                        <span className="text">
                            <h3>{clientCount}</h3>
                            <p>Clients</p>
                        </span>
                    </li>
                    <li>
                        <MedicalServicesOutlined className='bx' />
                        <span className="text">
                            <h3>{emailCount}</h3>
                            <p>Total Emails Processed</p>
                        </span>
                    </li>
                </ul>
                <div className="head-session1">
                    <div className="head-subsession1">
                        <ChartsDashboard />
                    </div>
                    {/* <div className="head-subsession1">
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default Dashboard