import React from 'react';
import { api } from '../utils/api';

import { PageContent, ZillowLogo } from '@zillow/constellation';

const Header = (): JSX.Element => {
  return (
    <div style={{ borderBottom: '1px solid #d8d8d8', background: '#fff' }}>
      <PageContent paddingY="md" marginY={0}>
        <ZillowLogo style={{ height: '44px' }} />
        {__PROD__ && (
          <a href={api.auth.signout} style={{ float: 'right', textDecoration: 'none' }}>
            Sign out
          </a>
        )}
      </PageContent>
    </div>
  );
};

export default Header;
