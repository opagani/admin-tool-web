import React, { useMemo } from 'react';
import { useSortBy, useTable } from 'react-table';
import type { PremiumTransaction } from '../../generated-types/graphql';

import { IconChevronDown, IconChevronUp, Table } from '@zillow/constellation';
import { convertCentsToDollarCurrency, sortByDate } from '../../utils/utils';

interface premiumTransactionsInterface {
  premiumTransactions: Array<PremiumTransaction>;
}

const PremiumTransactionTable = ({ premiumTransactions }: premiumTransactionsInterface): JSX.Element => {
  const columns = useMemo(
    () => [
      {
        id: 'premiumTransactionTable',
        Header: `Premium Transaction`,
        columns: [
          {
            id: 'chargeId',
            Header: 'Charge ID',
            accessor: 'chargeId',
          },
          {
            id: 'chargeStatus',
            Header: `Charge Status`,
            accessor: 'chargeStatus',
          },
          {
            id: 'formattedChargeDate',
            Header: `Charge Date`,
            accessor: 'formattedChargeDate',
            sortType: sortByDate,
          },
          {
            id: 'premiumAmountInCents',
            Header: 'Premium Amount',
            accessor: (premiumTransactions: PremiumTransaction) =>
              premiumTransactions?.premiumAmountInCents
                ? convertCentsToDollarCurrency(premiumTransactions.premiumAmountInCents)
                : '',
          },
          {
            id: 'transactionId',
            Header: 'Payout ID',
            accessor: 'transactionId',
          },
          {
            id: 'payoutStatus',
            Header: `Payout Status`,
            accessor: 'payoutStatus',
          },
          {
            id: 'formattedTransactionCreatedDate',
            Header: 'Transaction Created Date',
            accessor: 'formattedTransactionCreatedDate',
            sortType: sortByDate,
          },
          {
            id: 'formattedTransactionUpdatedDate',
            Header: 'Transaction Updated Date',
            accessor: 'formattedTransactionUpdatedDate',
            sortType: sortByDate,
          },
          {
            id: 'transactionType',
            Header: 'Transaction Type',
            accessor: 'transactionType',
          },
        ],
      },
    ],
    [],
  );

  const { allColumns, getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: premiumTransactions,
      initialState: {
        sortBy: [
          {
            id: 'formattedChargeDate',
            desc: true,
          },
        ],
      },
    },
    useSortBy,
  );

  return (
    <Table.Responsive>
      <Table aria-label={`History table`} alignments={allColumns.map(() => 'center')} size="sm" {...getTableProps()}>
        <Table.Header>
          {headerGroups.map((headerGroup, id) => (
            <Table.Row {...headerGroup.getHeaderGroupProps()} key={headerGroup.headers[id].id}>
              {headerGroup.headers.map((column) => (
                <Table.HeaderCell {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}>
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
          {rows.map((row) => {
            prepareRow(row);
            return (
              <Table.Row {...row.getRowProps()} key={`row-${row.id}`}>
                {row.cells.map((cell) => {
                  return (
                    <Table.Cell {...cell.getCellProps()} key={`cell-${cell.column.id}`}>
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

export default PremiumTransactionTable;
