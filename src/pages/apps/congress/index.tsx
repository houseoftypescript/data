import Button from '@mui/material/Button';
import axios from 'axios';
import { NextPage } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../../components/organisms/Breadcrumbs';
import AppsTemplate from '../../../components/templates/Apps';

const CongressPage: NextPage<{ congress: number[] }> = ({ congress }) => {
  return (
    <AppsTemplate>
      <main className="container mx-auto p-8">
        <Breadcrumbs />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-12 gap-4">
          {congress.map((value) => {
            return (
              <div key={value} className="col-span-1">
                <Link href={`/apps/congress/${value}`}>
                  <Button variant="outlined" className="w-full">
                    {value}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </AppsTemplate>
  );
};

export const getServerSideProps = async () => {
  const url: string = 'http://localhost:3000/api/congress';
  const response = await axios.get<{ congress: number[] }>(url);
  const congress = response.data.congress;
  return { props: { congress } };
};

export default CongressPage;
