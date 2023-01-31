import Button from '@mui/material/Button';
import { NextPage } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../components/organisms/Breadcrumbs';
import AppsTemplate from '../../components/templates/Apps';

const AppsPage: NextPage = () => {
  return (
    <AppsTemplate>
      <main className="container mx-auto p-8">
        <Breadcrumbs />
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <Link href={`/apps/congress`}>
              <Button variant="outlined" className="w-full">
                Congress
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </AppsTemplate>
  );
};

export default AppsPage;
