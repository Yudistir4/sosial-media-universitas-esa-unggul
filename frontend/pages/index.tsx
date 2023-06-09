import Image from 'next/image';
import { Inter } from 'next/font/google';
import Login from '@/components/Login';
import Home from '@/components/Home';
import { useAuth } from '@/store/user';
import { useEffect, useState } from 'react';
import useGetFromStore from '@/store/store';
// import { useAuth } from '@/store/user';

const inter = Inter({ subsets: ['latin'] });

export default function Index() {
  const user = useGetFromStore(useAuth, (state: any) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
    }
  }, [user, isLoading]);

  // useHasHydrated();
  if (isLoading) {
    return <div></div>;
  }

  return (
    <main className={`${inter.className}`}>{user ? <Home /> : <Login />}</main>
  );
}
