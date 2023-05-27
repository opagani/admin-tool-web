import React, { useMemo } from 'react';
import { useSortBy, useTable } from 'react-table';
import type { History, HistoryType } from '../../generated-types/graphql';

import { IconChevronDown, IconChevronUp, Table } from '@zillow/constellation';
import { sortByDate } from '../../utils/utils';

interface HistoryInterface {
  logs: History['logs'];
  searchValue: string;
}

const HistoryTable = ({ logs, searchValue }: HistoryInterface): JSX.Element => {
  const columns = useMemo(
    () => [
      {
        Header: `History for listingAlias ${searchValue}`,
        columns: [
          {
            Header: 'Listing Alias',
            accessor: 'idValue',
          },
          {
            Header: 'Action',
            accessor: 'action',
          },
          {
            Header: 'UserToken',
            accessor: 'userToken',
          },
          {
            Header: 'Message',
            accessor: 'message',
          },
          {
            Header: `Created Date - ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
            id: 'createdDate',
            sortType: sortByDate,
            accessor: (log: HistoryType) =>
              new Date(log.createdDate).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }),
          },
        ],
      },
    ],
    [searchValue],
  );

  const { allColumns, getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: logs as Array<HistoryType>,
      initialState: {
        sortBy: [
          {
            id: 'createdDate',
            desc: true,
          },
        ],
      },
    },
    useSortBy,
  );

  // Render the UI for your table
  return (
    <Table.Responsive>
      <Table aria-label={`History table`} alignments={allColumns.map(() => 'center')} size="sm" {...getTableProps()}>
        <Table.Header>
          {headerGroups.map((headerGroup, id) => (
            <Table.Row {...headerGroup.getHeaderGroupProps()} key={id}>
              {headerGroup.headers.map((column, id) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <Table.HeaderCell {...column.getHeaderProps(column.getSortByToggleProps())} key={id}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <>
                          {' '}
                          <IconChevronDown />
                        </>
                      ) : (
                        <>
                          {' '}
                          <IconChevronUp />
                        </>
                      )
                    ) : (
                      ''
                    )}
                  </span>
                </Table.HeaderCell>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body {...getTableBodyProps()}>
          {rows.map((row, id) => {
            prepareRow(row);
            return (
              <Table.Row {...row.getRowProps()} key={id}>
                {row.cells.map((cell, id) => {
                  return (
                    <Table.Cell {...cell.getCellProps()} key={id}>
                      {cell.render('Cell')}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Table.Responsive>
  );
};

export default HistoryTable;
