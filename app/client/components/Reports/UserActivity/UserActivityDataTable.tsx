import React, { useMemo } from 'react';
import type { Column, TableInstance } from 'react-table';
import { useSortBy, useTable } from 'react-table';
import type { UserActivities } from '../../../generated-types/graphql';

import UserActivityTable from './ActivityDataTable';
import { buildColumns } from './builder/buildUserActivity';

interface UserActivityDataType {
  userActivities: Array<UserActivities>;
  methodToInvoke: string;
}

const UserActivityDataTable = ({ userActivities, methodToInvoke }: UserActivityDataType): JSX.Element => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const columns = useMemo(() => buildColumns(methodToInvoke), [userActivities, methodToInvoke]);

  const tableInstance: TableInstance<UserActivities> = useTable(
    {
      columns: columns as Array<Column<UserActivities>>,
      data: userActivities as Array<UserActivities>,
      initialState: {
        hiddenColumns: methodToInvoke === 'getUserActivityOptIns' ? ['message'] : [''],
      },
    },
    useSortBy,
  );

  // Render the UI for your table
  return <UserActivityTable {...tableInstance} />;
};

export default UserActivityDataTable;
