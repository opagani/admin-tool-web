import React from 'react';
import { IconChevronDown, IconChevronUp, Table } from '@zillow/constellation';
import type { TableInstance } from 'react-table';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ActivityDataTable = ({
  allColumns,
  getTableProps,
  getTableBodyProps,
  headerGroups,
  rows,
  prepareRow,
}: TableInstance<any>): JSX.Element => (
  <Table.Responsive>
    <Table
      aria-label={`User activity data table`}
      alignments={allColumns.map(() => 'center')}
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

export default ActivityDataTable;
