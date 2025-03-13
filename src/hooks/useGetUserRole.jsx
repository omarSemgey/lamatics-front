import axios from 'axios';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useGetUserRole() {
    const [id, setId] = useState(0);
    const [role, setRole] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { pathname } = useLocation();

    useEffect(()=>{
        const getRole = async () => {
            await axios.get(`/auth/me`)
            .then((response) => {
                setRole(response.data.user.role);
                setId(response.data.user.user_id)
            }).catch((err) => {
                if (err.response?.data?.error === 'invalid_token') {
                    document.cookie = 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                    document.cookie = 'refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                }
                setRole(0);
            }).finally(() => {
                setIsLoading(false);
            })
        }

        getRole();
    },[pathname]);

    return { id,role, isLoading };
}