import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyToken } from '../store/actions/auth';

const GoogleSuccess = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      console.log('Token received:', token);
      localStorage.setItem('token', token);

      // ✅ Force token re-verification before navigation
      dispatch(verifyToken()).then(() => {
        navigate('/dashboardPanel');
      });
    }
  }, [token, navigate, dispatch]);

  return (
    <div className="text-center mt-20 text-lg font-semibold">
      Logging in via Google...
    </div>
  );
};

export default GoogleSuccess;
