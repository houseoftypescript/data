import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

export const CustomBreadcrumbs: React.FC = () => {
  const router = useRouter();
  const paths = router.asPath.split('/');

  return (
    <Breadcrumbs aria-label="breadcrumb" className="mb-8">
      {paths.map((path: string, index: number) => {
        if (paths.length - 1 === index) {
          return (
            <Typography key={path} color="text.primary" className="uppercase">
              {path}
            </Typography>
          );
        }
        return (
          <Link
            key={path}
            href={`/${paths
              .slice(0, index + 1)
              .filter((path: string) => path)
              .join('/')}`}
            className="uppercase"
          >
            {path || 'home'}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default CustomBreadcrumbs;
