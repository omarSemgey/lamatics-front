import './Hero.css';
import Loading from '../../Loading/Loading';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useGetUserRole from '../../../hooks/useGetUserRole';
import axios from 'axios';

export default function Hero() {
  const [count,setCount] = useState(0);
  const {role,isLoading} = useGetUserRole();
  const navigate = useNavigate();

  useEffect(()=>{
  axios.get(`/counts/users`)
  .then((response) => {
    setCount(response.data.user_count);
  });
  },[]);

  if (isLoading) {
    return <Loading></Loading>
  }

  if(role > 1){
    navigate('/dashboard');
  }

  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Test Your Scientific Skills</h1>
        <p>More than <span className="count">{count}</span> students are testing their knowledge now</p>
        <Link to={role == 1 ? '/quizzes' : '/login'}>Start the Quiz!</Link>
      </div>
    </div>
  );
}