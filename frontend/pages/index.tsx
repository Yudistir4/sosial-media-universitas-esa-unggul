import Image from 'next/image';
import { Inter } from 'next/font/google';
import Login from '@/components/Login';
import Home from '@/components/Home';
import { useAuth } from '@/store/user';
import { useEffect, useState } from 'react';
import useGetFromStore from '@/store/store';
import { QueryParams } from '@/typing';
// import { useAuth } from '@/store/user';

const inter = Inter({ subsets: ['latin'] });

export default function Index({ queryParams }: { queryParams: QueryParams }) {
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
    <main className={`${inter.className}`}>{user ? <Home /> : <Login queryParams={queryParams} />}</main>
  );
}
export async function getServerSideProps(context: any) {
  const queryParams = context.query as QueryParams;

  return {
    props: {
      queryParams,
    },
  };
}
