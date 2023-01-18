import Button from '@mui/material/Button';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CHAMBERS } from '../../../../configs';
import Breadcrumbs from '../../../../components/organisms/Breadcrumbs';

const ChamberPage: NextPage = () => {
  const router = useRouter();
  const congress = router.query.congress as string;

  return (
    <main className="container mx-auto p-8">
      <Breadcrumbs />
      <div className="grid grid-cols-2 gap-4">
        {CHAMBERS.map((chamber) => {
          return (
            <Link key={chamber} href={`/apps/congress/${congress}/${chamber}`}>
              <Button variant="outlined" className="w-full">
                {chamber}
              </Button>
            </Link>
          );
        })}
      </div>
    </main>
  );
};

export default ChamberPage;
