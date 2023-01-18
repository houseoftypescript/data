import Button from '@mui/material/Button';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Breadcrumbs from '../../../../../components/organisms/Breadcrumbs';

const DetailsPage: NextPage = () => {
  const router = useRouter();
  const congress = router.query.congress as string;
  const chamber = router.query.chamber as string;

  return (
    <main className="container mx-auto p-8">
      <Breadcrumbs />
      <div className="grid grid-cols-2 gap-4">
        {['commitees', 'members'].map((page) => {
          return (
            <Link
              key={page}
              href={`/apps/congress/${congress}/${chamber}/${page}`}
            >
              <Button variant="outlined" className="w-full uppercase">
                {page}
              </Button>
            </Link>
          );
        })}
      </div>
    </main>
  );
};

export default DetailsPage;
