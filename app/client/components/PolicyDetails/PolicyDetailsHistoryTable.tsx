import React, { useMemo } from 'react';
import { useSortBy, useTable } from 'react-table';
import type { HistoryForPolicyRelatedActions, HistoryForPolicyRelatedActionsType } from '../../generated-types/graphql';

import { IconChevronDown, IconChevronUp, Table } from '@zillow/constellation';
import { sortByDate } from '../../utils/utils';

interface HistoryForPolicyRelatedActionsInterface {
  logs: HistoryForPolicyRelatedActions['logs'];
}

const PolicyDetailsHistoryTable = ({ logs }: HistoryForPolicyRelatedActionsInterface): JSX.Element => {
  const columns = useMemo(
    () => [
      {
        Header: `History`,
        columns: [
          {
            Header: 'User Token',
            accessor: 'sourceId',
          },
          {
            Header: 'Action',
            accessor: 'action',
          },
          {
            Header: 'Message',
            accessor: 'message',
          },
          {
            Header: `Created Date - ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
            id: 'createdDate',
            sortType: sortByDate,
            accessor: (logs: HistoryForPolicyRelatedActionsType) =>
              new Date(logs.createdDate).toLocaleString('en-US', {
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
    [],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: logs as Array<HistoryForPolicyRelatedActionsType>,
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
      <Table
        aria-label={`History for related policy actions table`}
        alignments={['center', 'center', 'left', 'center']}
        size="sm"
        {...getTableProps()}
      >
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

export default PolicyDetailsHistoryTable;
