import Button from '@mui/material/Button';
import Link from 'next/link';
import React, { ReactNode } from 'react';

type AppsTemplateProps = {
  children: ReactNode;
};

export const AppsTemplate: React.FC<AppsTemplateProps> = ({ children }) => {
  const year = new Date().getFullYear();
  return (
    <div className="min-h-screen">
      <nav className="border-b shadow">
        <div className="container mx-auto px-8 py-4">
          <div className="flex justify-between">
            <Link href="/apps">
              <h1 className="text-xl uppercase">Apps</h1>
            </Link>
            <Button variant="outlined" className="uppercase">
              LOG OUT
            </Button>
          </div>
        </div>
      </nav>
      <div className="min-h-screen">{children}</div>
      <footer className="border-t shadow">
        <div className="container mx-auto px-8 py-4">
          <div className="flex justify-between">&copy; {year}</div>
        </div>
      </footer>
    </div>
  );
};

export default AppsTemplate;
