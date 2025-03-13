import { useEffect, useState } from 'react';
import './Dashboard.css'
import LeftNav from './LeftNav/LeftNav';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Dashboard(){
    const location = useLocation();
    const [page,setPage] = useState(null);

    useEffect(()=>{
        setPage(location.pathname.split('/')[2]);
    },[location.pathname.split('/')[2]])

    return(
        <>
        <div className="dashboard">
        <LeftNav></LeftNav>
        <div className='dashboard-content'>
            {
                page !== undefined &&(
                    <div className='page-header'>
                        <div className='upper-header'>
                            <Link to='/dashboard' className='link'>DASHBOARD</Link>
                            <span className='slash'>/</span>
                            <span className='page'>{page}</span>
                        </div>
                        <div className='lower-header'>
                            <h1 className='title'>{page}</h1>
                            <Link to={`/dashboard/${page}/create`} className='new'>add new</Link>
                        </div>
                    </div>
                )
            }
            <Outlet></Outlet>
        </div>
        </div>
        </>
    )
}