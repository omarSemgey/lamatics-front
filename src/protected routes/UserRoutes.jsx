import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useGetUserRole from "../hooks/useGetUserRole";
import Loading from "../components/Loading/Loading";
import { useEffect } from "react";

export default function UserRoutes() {
    const { id, role, isLoading } = useGetUserRole();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isLoading && role !== 1) {
            if(role == 2){
                navigate('/dashboard');
            }else if(!(role == 0 && location.pathname == '/')){
                navigate('/login');
            }
        }
    }, [isLoading, role, navigate]);

    if (isLoading) {
        return <Loading />;
    }

    if(location.pathname == '/profile' || location.pathname == '/profile/update'){
        return <Outlet context={id}></Outlet>;
    }else{
        return <Outlet></Outlet>;
    }
}