import useAuthStore from '@/store/auth-context';
import { CheckCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Index = () => {
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null); // State to store the user data
  const location = useLocation();
  const navigate = useNavigate();
  
  const { login } = useAuthStore();

  useEffect(() => {
    
    const params = new URLSearchParams(location.search);
    
    
    if (params.get('verified') === 'true') {
      setMessage('Your email has been successfully verified!');
    }

    const encodedData = params.get('data');
    if (encodedData) {
      try {
      
        const decodedData = decodeURIComponent(encodedData);
        const parsedData = JSON.parse(decodedData);

       
        setUserData(parsedData);

       
        window.history.replaceState(null, '', window.location.pathname);
      } catch (error) {
        console.error('Error decoding or parsing data:', error);
      }
    }
  }, [location]);

  const redirectToHome = () => {
    if (userData) {
      console.log("userdata:" + userData)
      login(userData); 
      navigate('/', { 
        state: { justRegistered: true },
        replace: true 
      });
    } else {
      console.error('User data is missing!');
    }
  };

  return (
    <div>
      <div className="bg-[#121212] text-white">
      <div className="flex flex-col h-screen items-center justify-center m-auto">
        <div className="rounded-full bg-teal-500 p-4 h-48 w-48 flex items-center justify-center">
          <div className="rounded-full bg-teal-700 p-4 h-32 w-32 flex items-center justify-center">
            <CheckCheck size={48} className="text-white" />
          </div>
        </div>
        <div className="flex flex-col items-center my-3 text-xl font-light">
          <span>Email has been verified!</span>
          <span>Proceed to home page..</span>
        </div>
        {message && <div className="success-message">{message}</div>}
      <button className='px-4 py-2 bg-teal-600 rounded-lg' onClick={redirectToHome}>Go to Home</button>
      </div>
    </div>
     
      
    </div>
  );
};

export default Index;
