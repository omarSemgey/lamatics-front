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
    axios.post('/auth/logout')
    .then(() => {
        // Deleting tokens is handled by the backend
        localStorage.removeItem('isAuthenticated')
        setIsLoggingOut(false);
        navigate('/');
    });
  }

  function handleLogoutCancel(){
      setIsLoggingOut(false);
  }

  if (isLoading) {
    return <Loading></Loading>;
  }

  return(
    <>
    <div className='profile'>
      <div className="user-profile-container">
        <div className="user-profile-card">
          <h1 className="user-profile-title"> : الملف الشخصي</h1>

          <div className="user-detail">
            <span className="detail-value">{data.name}</span>
            <span className="detail-label"> : الاسم</span>
          </div>

          <div className="user-detail">
            <span className="detail-value">{data.email}</span>
            <span className="detail-label"> : البريد الالكتروني</span>
          </div>

          <div className="user-detail">
            <span className="detail-value">{data.user_submissions_count}</span>
            <span className="detail-label"> : عدد الامتحانات الماخوذة</span>
          </div>
          <div className="actions">
            <Link to={`/profile/history`} className="submissions link">سجل الاختبارات</Link>
            <Link to={`/profile/update`} className="update link">تعديل الملف الشخصي</Link>
            <button className="logout link" onClick={handleLogout}>
              <FontAwesomeIcon className='icon' icon={faSignOutAlt}></FontAwesomeIcon>
              تسجيل الخروج
            </button>          
          </div>
        </div>
      </div>
    </div>
    <ConfirmationModal
      isOpen={isLoggingOut}
      onClose={handleLogoutCancel}
      onConfirm={handleLogoutConfirm}
      message="هل انت متاكد من انك تريد تسجيل الخروج؟"
    />
    </>
  )
}
