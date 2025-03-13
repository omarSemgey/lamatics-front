import { Outlet, useNavigate } from "react-router-dom";
import useGetUserRole from "../hooks/useGetUserRole";
import Loading from "../components/Loading/Loading";
import { useEffect } from "react";

export default function AdminRoutes() {
    const { role, isLoading } = useGetUserRole();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && role !== 2) {
            navigate('/');
        }
    }, [isLoading, role, navigate]);

    if (isLoading) {
        return <Loading />;
    }

    return role === 2 ? <Outlet /> : null;
}