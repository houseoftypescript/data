import { Button } from '@mui/material';
import { NextPage } from 'next';
import Link from 'next/link';

const NotFoundPage: NextPage = () => {
  return (
    <main className="w-full h-screen">
      <div className="flex items-center justify-center w-full h-full">
        <div>
          <h1 className="text-6xl">404</h1>
          <Link href="/">
            <Button className="w-full" variant="outlined">
              Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
