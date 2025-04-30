'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Wrench, Laugh, BarChart2, UserCog2, LogOut, UserCircle2 } from 'lucide-react';
import Cookies from 'js-cookie';
import Popup from '../components/popup-sym';

interface UserData {
  id: number;
  name: string;
  username: string;
  password: string;
  Department?: {
    id: number;
    departement: string;
  };
}

interface CardItem {
  id: number;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);


  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const response = await fetch('https://app.prazelab.my.id/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        if (response.status === 401) {
          Cookies.remove('token');
          setSessionExpired(true);
          router.push('/auth/login');
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch user data');
        }

        const data = await response.json();
        console.log('userData fetched:', data.data);
        setUserData(data.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');

        const storedUser = Cookies.get('user');
        if (storedUser) {
          try {
            setUserData(JSON.parse(storedUser));
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // useEffect(() => {
  //   if (userData) {
  //     console.log('User data loaded:', userData);
  //   }
  // }, [userData]);

  useEffect(() => {
    if (userData) {
      console.log('User data loaded:', userData);
    }
    if (sessionExpired) {
      alert('Sesi Anda telah habis. Silakan login kembali.');
      router.push('/auth/login');
    }
  }, [sessionExpired, router, userData]);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    Cookies.remove('token');
    Cookies.remove('user');
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push('/auth/login');
  }, [router]);

  const handleNavigation = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  const cardData: CardItem[] = [
    { id: 1, label: 'Asset Care', path: '/dashboard/assetcare', icon: Wrench, iconColor: 'text-blue-600' },
    { id: 2, label: 'Speak Your Mind', path: '/dashboard/speakyourmind', icon: Laugh, iconColor: 'text-green-600' },
    { id: 3, label: 'Fitur 3', path: '/dashboard/fitur3', icon: BarChart2, iconColor: 'text-purple-600' },
    { id: 4, label: 'Account Setting', path: '/dashboard/account', icon: UserCog2, iconColor: 'text-orange-600' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6fffa] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isLoggingOut) {
    return (
      <div className="min-h-screen bg-[#f6fffa] p-4 md:p-10 flex items-center justify-center">
        <div className="text-center">
          <p className="animate-pulse text-gray-500">See you...</p>
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#f6fffa] justify-center">
      <div className="flex flex-col items-center space-y-8 md:space-y-14 w-full max-w-5xl mx-auto p-4 md:p-20">
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-2">
          <div className="relative group">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold rounded-lg px-3 py-2 bg-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <LogOut className="w-5 h-5" size={20} />
            </button>
            <span className="absolute right-full top-1/2 -translate-y-1/2 ml-2 mr-2 whitespace-nowrap bg-red-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              Logout
            </span>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-4 md:mb-6">
            SELAMAT DATANG DI SISTEM INFORMASI TERPUSAT
          </h1>
          <h2 className="text-lg md:text-xl">
            Halloo{' '}
            <span className="font-semibold text-blue-600">
              {userData?.name ?? userData?.username ?? 'Loading...'}
            </span>
            !
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 w-full">
          {cardData.map(({ id, label, path, icon: Icon, iconColor }) => {
            return (
              <button
                key={id}
                onClick={() => {
                  if (label === 'Speak Your Mind') {
                    openPopup();
                  } else {
                    handleNavigation(path);
                  }
                }}
                className="bg-white rounded-2xl shadow-md h-28 md:h-32 flex flex-col items-center justify-center text-gray-600 text-base md:text-lg font-semibold hover:shadow-xl hover:bg-gray-50 p-4 hover:scale-105 transform transition-transform duration-200"
              >
                <Icon className={`w-6 h-6 md:w-8 md:h-8 mb-2 ${iconColor}`} />
                {label}
              </button>
            );
          })}
        </div>
      </div>
      <Popup isOpen={isPopupOpen} onClose={closePopup} />
    </div>
  );
}
