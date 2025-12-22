import "./Profile.css";
import Loading from "../../Loading/Loading";
import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";

export default function Profile() {
  const id = useOutletContext();
  const navigate = useNavigate();
  const [data,setData] = useState(null);
  const [isLoading,setIsLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      await axios.get(`/users/${id}`)
        .then((response) => {
          setData(response.data.user);
          setIsLoading(false);
      });
    };

    fetchUser();
  },[id]);

  function handleLogout(){
    setIsLoggingOut(true);
  }

  async function handleLogoutConfirm(){
    setIsWorking(true);
    try {
      axios.post('/auth/logout')
      .then(() => {
        localStorage.removeItem('isAuthenticated')
        navigate('/');
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsWorking(false);
      setIsLoggingOut(false);
    }
  }

  function handleLogoutCancel(){
      setIsLoggingOut(false);
  }

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
      <>
      <div className='profile'>
        <div className="user-profile-container">
          <div className="user-profile-card">
            <h1 className="user-profile-title">Profile:</h1>

            <div className="user-detail">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{data.name}</span>
            </div>

            <div className="user-detail">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{data.email}</span>
            </div>

            <div className="user-detail">
              <span className="detail-label">Quizzes Taken:</span>
              <span className="detail-value">{data.user_submissions_count}</span>
            </div>

            <div className="actions">
              <Link to={`/profile/history`} className="submissions link">Quiz History</Link>
              <Link to={`/profile/update`} className="update link">Edit Profile</Link>
              <button className="logout link" onClick={handleLogout}>
                <FontAwesomeIcon className='icon' icon={faSignOutAlt}></FontAwesomeIcon>
                Logout
              </button>          
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isLoggingOut}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        isWorking={isWorking}
        message="Are you sure you want to log out?"
      />
      </>
  )
}
