import dynamic from 'next/dynamic';

const WalletPage = dynamic(() => import('./WalletPage'), {
  ssr: false
});

export default function Home() {
  return <WalletPage />;
}
