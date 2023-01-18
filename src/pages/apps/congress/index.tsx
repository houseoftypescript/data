import Button from '@mui/material/Button';
import axios from 'axios';
import { NextPage } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../../components/organisms/Breadcrumbs';

const CongressPage: NextPage<{ congress: number[] }> = ({ congress }) => {
  return (
    <main className="container mx-auto p-8">
      <Breadcrumbs />
      <div className="grid grid-cols-12 gap-4">
        {congress.map((value) => {
          return (
            <Link key={value} href={`/apps/congress/${value}`}>
              <Button variant="outlined">{value}</Button>
            </Link>
          );
        })}
      </div>
    </main>
  );
};

export const getServerSideProps = async () => {
  const url: string = 'http://localhost:3000/api/congress';
  const response = await axios.get<{ congress: number[] }>(url);
  const congress = response.data.congress;
  return { props: { congress } };
};

export default CongressPage;
