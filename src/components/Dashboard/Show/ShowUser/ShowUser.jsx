import { Link, useParams } from 'react-router-dom';
import './ShowUser.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../../Loading/Loading';

export default function ShowUser(){
    const { user:userId } = useParams();

    const [data,setData] = useState(null);
    const [isLoading,setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            await axios.get(`/users/${userId}`)
            .then((response) => {
                setData(response.data.user);
                setIsLoading(false);
            });
        };

        fetchUser();
    },[userId]);

    if (isLoading) {
        return <Loading></Loading>;
    }

    return(
        <>
            <div className='show-user'>
                <div className="user-profile-container">
                    <div className="user-profile-card">
                        <h1 className="user-profile-title">User Information</h1>

                        <div className="user-detail">
                            <span className="detail-label">Username:</span>
                            <span className="detail-value">{data.name}</span>
                        </div>

                        <div className="user-detail">
                            <span className="detail-label">Email:</span>
                            <span className="detail-value">{data.email}</span>
                        </div>

                        <div className="user-detail">
                            <span className="detail-label">Submissions:</span>
                            <span className="detail-value">{data.user_submissions_count}</span>
                        </div>

                        <Link to={`/dashboard/users/${userId}/submissions`} className="submissions-link">View User Submissions</Link>
                    </div>
                </div>
            </div>
        </>
    )
}