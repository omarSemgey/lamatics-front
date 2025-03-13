import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import { Outlet, useOutletContext } from 'react-router-dom';

export default function Users(){
    const id = useOutletContext();
    return(
        <>
        <div className="users">
        <Navbar></Navbar>
    <Outlet context={id}></Outlet>
        <Footer></Footer>
        </div>
        </>
    )
}