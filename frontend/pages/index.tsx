import Image from 'next/image';
import { Inter } from 'next/font/google';
import Login from '@/components/Login';
import Home from '@/components/Home';
import { useAuth } from '@/store/user';
// import { useAuth } from '@/store/user';

const inter = Inter({ subsets: ['latin'] });

export default function Index() {
  const user = useAuth((state) => state.user);
  return (
    <main className={`${inter.className}`}>{user ? <Home /> : <Login />}</main>
  );
}
