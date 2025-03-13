import './DashboardHero.css';
import { useEffect,useState } from 'react';
import axios from 'axios';

const DashboardHero = () => {
    const [usersCount,setUsersCount] = useState(0);
    const [quizzesCount,setQuizzesCount] = useState(0);
    const [submissionsCount,setSubmissionsCount] = useState(0);

    useEffect(()=>{
        axios.get('/counts')
            .then(response => {
                setUsersCount(response.data.counts.user_count)
                setQuizzesCount(response.data.counts.quiz_count)
                setSubmissionsCount(response.data.counts.submission_count)
            })
    },[]);

    return (
        <div className='dashboard-hero'>
        <div className='header'>Dashboard</div>
        <div className='page-header'>
            <p className='title'>lamatics</p>
            <span className='info'>:احصائيات الموقع</span>
        </div>
        <div className='cards'>
            <div className='card'>
                <div className='card-text'>
                    <h1 className='counter'>{quizzesCount}</h1>
                    <span>Quizzes Count</span>
                </div>
            </div>
            <div className='card'>
                <div className='card-text'>
                    <h1 className='counter'>{usersCount}</h1>
                    <span>Users Count</span>
                </div>
            </div>
            <div className='card'>
                <div className='card-text'>
                    <h1 className='counter'>{submissionsCount}</h1>
                    <span>Submissions Count</span>
                </div>
            </div>
        </div>
        </div>
    );
};

export default DashboardHero;