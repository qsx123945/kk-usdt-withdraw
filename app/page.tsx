'use client';
import dynamic from 'next/dynamic';

const WalletPage = dynamic(() => import('./WalletPage'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function Home() {
  return <WalletPage />;
}
