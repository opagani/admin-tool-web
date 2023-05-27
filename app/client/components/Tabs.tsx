import React from 'react';
import { useHistory } from 'react-router-dom';

import { Tabs } from '@zillow/constellation';

const getActiveTab = () => {
  // Expecting path to be [baseUrl]/rent-guarantee/adminWeb/*something*

  const tabName = window.location.pathname.split('/')[3];
  switch (tabName) {
    case 'reports':
      return 'reports';
    case 'user-activity':
      return 'user-activity';
    case '':
    default:
      return 'search';
  }
};

const TabNav = (): JSX.Element => {
  const history = useHistory();

  return (
    <Tabs>
      <Tabs.List
        defaultSelected={getActiveTab()}
        onSelected={(tab: string) => history.push(tab !== 'search' ? `/${tab}` : '/')}
        aria-label="Policies lease admin"
      >
        <Tabs.Tab id="search">Search</Tabs.Tab>
        <Tabs.Tab id="reports">Reports</Tabs.Tab>
        <Tabs.Tab id="user-activity">User Activity</Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
};

export default TabNav;
