import React, { useMemo } from 'react';
import { useTable } from 'react-table';
import type { MonthlyPremiumPayments } from '../../generated-types/graphql';

import { Table } from '@zillow/constellation';
import { convertCentsToDollarCurrency } from '../../utils/utils';

interface MonthlyPremiumPaymentsInterface {
  monthlyPremiumPayments: Array<MonthlyPremiumPayments>;
}

const PremiumScheduleTable = ({ monthlyPremiumPayments }: MonthlyPremiumPaymentsInterface): JSX.Element => {
  const columns = useMemo(
    () => [
      {
        id: 'premiumPaymentSchedule',
        Header: `Premium Payment Schedule`,
        columns: [
          {
            id: 'sequenceNumber',
            Header: 'Sequence Number',
            accessor: 'sequenceNumber',
          },
          {
            id: 'invoiceDate',
            Header: `Invoice Date - ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
            accessor: 'invoiceDate',
          },
          {
            id: 'totalDueAmount',
            Header: 'Total Due Amt',
            accessor: (monthlyPremiumPayments: MonthlyPremiumPayments) =>
              convertCentsToDollarCurrency(monthlyPremiumPayments.totalDueAmount),
          },
          {
            id: 'premiumAmount',
            Header: 'Premium Amt',
            accessor: (monthlyPremiumPayments: MonthlyPremiumPayments) =>
              convertCentsToDollarCurrency(monthlyPremiumPayments.premiumAmount),
          },
          {
            id: 'stampingFeeAmount',
            Header: 'Stamping Fee Amt',
            accessor: (monthlyPremiumPayments: MonthlyPremiumPayments) =>
              convertCentsToDollarCurrency(monthlyPremiumPayments.stampingFeeAmount || 0),
          },
          {
            id: 'surplusLinesTaxAmount',
            Header: 'Surplus Lines Tax Amt',
            accessor: (monthlyPremiumPayments: MonthlyPremiumPayments) =>
              convertCentsToDollarCurrency(monthlyPremiumPayments.surplusLinesTaxAmount || 0),
          },
        ],
      },
    ],
    [],
  );

  const { allColumns, getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: monthlyPremiumPayments,
  });

  return (
    <Table.Responsive>
      <Table aria-label={`History table`} alignments={allColumns.map(() => 'center')} size="sm" {...getTableProps()}>
        <Table.Header>
          {headerGroups.map((headerGroup, id) => (
            <Table.Row {...headerGroup.getHeaderGroupProps()} key={id}>
              {headerGroup.headers.map((column) => (
                <Table.HeaderCell {...column.getHeaderProps()} key={column.id}>
                  {column.render('Header')}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <Table.Row {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => {
                  return (
                    <Table.Cell {...cell.getCellProps()} key={cell.column.id}>
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

export default PremiumScheduleTable;
