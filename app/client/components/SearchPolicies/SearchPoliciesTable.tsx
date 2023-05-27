/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import { api } from '../../utils/api';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import type { Cell, Column, FilterTypes, Row } from 'react-table';
import { useBlockLayout, useFilters, useResizeColumns, useSortBy, useTable } from 'react-table';
import type { Policies, Policy } from '../../generated-types/graphql';
import { SortBy, SortDir } from '../../generated-types/graphql';
// A great library for fuzzy filtering/sorting items
import { matchSorter } from 'match-sorter';

import {
  IconChevronDown,
  IconChevronUp,
  IconCopyOutline,
  Table,
  Toast,
  ToastProvider,
  withToast,
} from '@zillow/constellation';
import { formatToUTC, sortByDate } from '../../utils/utils';

const Styles = styled.div`
  .resizer {
    display: inline-block;
    background: blue;
    width: 2px;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    transform: translateX(50%);
    z-index: 1;
    ${'' /* prevents from scrolling while dragging on touch devices */}
    touch-action:none;

    &.isResizing {
      background: red;
    }
  }
`;

type SortType = (sortBy: SortBy, sortDir: SortDir) => void;

interface SearchPoliciesTableType {
  policies: Policies['policies'];
  searchType: string;
  searchValue: string;
  setSort: SortType;
  sortBy: SortBy;
  sortDir: SortDir;
}

interface SearchPoliciesTableUIType {
  defaultColumn: {
    minWidth: number;
    width: number;
    maxWidth: number;
  };
  columns: Array<Column<Policy>>;
  data: Array<Policy>;
  filterTypes: FilterTypes<Policy>;
  setSort: SortType;
  sortBy: SortBy;
  sortDir: SortDir;
  getCellProps: (cell: Cell<Policy, unknown>) => Record<string, unknown>;
}

interface ColumnFilter {
  filterValue: string;
  setFilter: (columnId: string, filterValue?: string) => void;
  preFilteredRows: Array<Row>;
}

const onHeaderClick = (column: Column<Policy>, sortDir: SortDir, setSort: SortType) => {
  if (!Object.values(SortBy).includes(column.id as SortBy)) {
    return;
  }
  switch (sortDir) {
    case SortDir.Asc:
      setSort(column.id as SortBy, SortDir.Desc);
      break;
    default:
      setSort(column.id as SortBy, SortDir.Asc);
  }
};

// Define a default UI for filtering
const DefaultColumnFilter = ({ filterValue, setFilter, preFilteredRows }: ColumnFilter): JSX.Element => {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue}
      onChange={(e) => {
        setFilter('renterIds', e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
};

// This is a custom filter UI for selecting
// a unique option from a list
const SelectColumnFilter = ({ filterValue, setFilter, preFilteredRows }: ColumnFilter): JSX.Element => {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values['policyStatus']);
    });
    return [...options.values()];
  }, [preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
        setFilter('policyStatus', event.target.value || undefined)
      }
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={String(option)}>
          {String(option)}
        </option>
      ))}
    </select>
  );
};

const fuzzyTextFilterFn = (rows: Array<Row>, id: string | number, filterValue: string) =>
  matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val: unknown) => !val;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const IconComponent = withToast(({ enqueueToast, value }: any) => {
  const updateClipboard = React.useCallback(
    (newClip: string) => {
      navigator.clipboard.writeText(newClip).then(
        () => {
          enqueueToast(<Toast appearance="info" body={`Copied to the clipboard successfully`} />);
        },
        (err) => {
          // eslint-disable-next-line no-console
          console.error('Failed to copy the text to clipboard.', err);
        },
      );
    },
    [enqueueToast],
  );

  return (
    <IconCopyOutline
      style={{ float: 'right' }}
      onClick={() => updateClipboard(typeof value == 'object' ? value.props.children : value)}
    />
  );
});

const SearchPoliciesTableUI = ({
  defaultColumn,
  columns,
  data,
  filterTypes,
  getCellProps,
  setSort,
  sortBy,
  sortDir,
}: SearchPoliciesTableUIType): JSX.Element => {
  const { allColumns, getTableProps, getTableBodyProps, headerGroups, prepareRow, resetResizing, rows } = useTable(
    {
      defaultColumn,
      columns,
      data,
      filterTypes,
      getCellProps,
      initialState: {},
      manualSortBy: true,
    },
    useBlockLayout,
    useFilters,
    useResizeColumns,
    useSortBy,
  );

  // Render the UI for your table
  return (
    <>
      <button onClick={resetResizing as () => void}>Reset Resizing</button>
      <Table.Responsive>
        <Table aria-label={`Policies table`} alignments={allColumns.map(() => 'center')} size="sm" {...getTableProps()}>
          <Table.Header>
            {headerGroups.map((headerGroup, id) => (
              <Table.Row {...headerGroup.getHeaderGroupProps()} key={id}>
                {headerGroup.headers.map((column, id) => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <Table.HeaderCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={id}
                    onClick={() => onHeaderClick(column, sortDir, setSort)}
                  >
                    {column.render('Header')}
                    {/* Use column.getResizerProps to hook up the events correctly */}
                    <div {...column.getResizerProps()} className={`resizer ${column.isResizing ? 'isResizing' : ''}`} />
                    {/* Add a sort direction indicator */}
                    <span>
                      {column.id === sortBy ? (
                        sortDir === SortDir.Desc ? (
                          <>
                            <IconChevronDown />
                          </>
                        ) : (
                          <>
                            <IconChevronUp />
                          </>
                        )
                      ) : (
                        ` `
                      )}
                    </span>
                    {/* Render the columns filter UI */}
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
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
                      <Table.Cell
                        {...cell.getCellProps([
                          {
                            style: cell.getCellProps().style,
                          },
                          getCellProps(cell),
                        ])}
                        key={id}
                      >
                        {cell.render('Cell')}
                        {cell.value ? (
                          <ToastProvider>
                            <IconComponent value={cell.value} />
                          </ToastProvider>
                        ) : null}
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Table.Responsive>
    </>
  );
};

const SearchPoliciesTable = ({
  policies,
  searchType,
  searchValue,
  setSort,
  sortBy,
  sortDir,
}: SearchPoliciesTableType): JSX.Element => {
  const policiesTitle = policies.length > 1 ? 'Policies' : 'Policy';

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      // fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows: Array<Row>, id: string | number, filterValue: string) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    [],
  );

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 50,
      width: 150,
      maxWidth: 400,
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    [],
  );

  const columns = React.useMemo(
    () => [
      {
        Header: `${policiesTitle} for ${searchType} = ${searchValue}`,
        columns: [
          {
            Header: 'Policy Id',
            id: 'policyId',
            accessor: (policies: Policy) => (
              <Link
                to={{
                  pathname: `/policy/${policies.policyId}/`,
                  state: { fromDashboard: true },
                }}
              >
                {policies.policyId}
              </Link>
            ),
            disableFilters: true,
            width: 250,
            disableSortBy: true,
          },
          {
            Header: 'Landlord User Token',
            id: 'landlordUserToken',
            accessor: (policies: Policy) => (
              <Link
                to={{
                  pathname: `/user/${policies.landlordUserToken}`,
                  state: { fromDashboard: true },
                }}
              >
                {policies.landlordUserToken}
              </Link>
            ),
            disableFilters: true,
            disableSortBy: true,
          },
          {
            Header: 'Listing Alias',
            accessor: 'listingAlias',
            disableFilters: true,
            width: 200,
            disableSortBy: true,
          },
          {
            Header: 'Application Id',
            id: 'applicationId',
            accessor: (policies: Policy) => policies.applicationId.id,
            disableFilters: true,
            width: 275,
            disableSortBy: true,
          },
          {
            Header: 'Lease Id',
            id: 'leaseId',
            accessor: (policies: Policy) => policies.leaseId.id,
            disableFilters: true,
            disableSortBy: true,
          },
          {
            Header: 'Lease Start',
            sortType: sortByDate,
            accessor: (policies: Policy) => formatToUTC(policies.leaseTermStartDate as Date),
            disableFilters: true,
            width: 125,
            disableSortBy: true,
          },
          {
            Header: 'Lease End',
            sortType: sortByDate,
            accessor: (policies: Policy) => formatToUTC(policies.leaseTermEndDate as Date),
            disableFilters: true,
            width: 125,
            disableSortBy: true,
          },
          {
            Header: 'Payment Id',
            id: 'paymentId',
            accessor: (policies: Policy) =>
              policies.paymentId?.id && (
                <a href={api.radmin.redirect(policies.paymentId?.id as number)} target="_blank" rel="noreferrer">
                  {policies.paymentId?.id}
                </a>
              ),
            disableFilters: true,
            disableSortBy: true,
          },
          {
            Header: 'Policy Start',
            id: 'policyStartDate',
            accessor: (policies: Policy) => formatToUTC(policies.policyTermStartDate as Date),
            disableFilters: true,
            width: 125,
            canSort: true,
          },
          {
            Header: 'Policy End',
            id: 'policyEndDate',
            accessor: (policies: Policy) => formatToUTC(policies.policyTermEndDate as Date),
            disableFilters: true,
            width: 125,
            canSort: true,
          },
          {
            Header: 'Renter Ids',
            id: 'renterIds',
            accessor: (policies: Policy) => policies.renterIds?.join(', '),
            Filter: DefaultColumnFilter,
            filter: 'text',
            disableFilters: false,
            width: 200,
            disableSortBy: true,
          },
          {
            Header: 'Status',
            id: 'policyStatus',
            accessor: (policies: Policy) => policies.policyStatus?.toLowerCase(),
            Filter: SelectColumnFilter,
            filter: 'includes',
            disableFilters: false,
            width: 275,
            disableSortBy: true,
          },
          {
            Header: `Created Date ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
            id: 'createdDate',
            accessor: (policies: Policy) =>
              new Date(policies.createdDate).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }),
            disableFilters: true,
            width: 250,
            canSort: true,
          },
        ],
      },
    ],
    [policiesTitle, searchType, searchValue],
  );

  return (
    <Styles>
      <SearchPoliciesTableUI
        defaultColumn={defaultColumn}
        columns={columns}
        data={policies as Array<Policy>}
        filterTypes={filterTypes}
        setSort={setSort}
        sortBy={sortBy}
        sortDir={sortDir}
        getCellProps={(cellInfo) => {
          let cellColor: 'red' | 'green' | 'black';

          switch (true) {
            case cellInfo.column.id === 'policyStatus' && cellInfo.value === 'expired':
              cellColor = 'red';
              break;
            case cellInfo.column.id === 'policyStatus' && cellInfo.value === 'active':
              cellColor = 'green';
              break;
            default:
              cellColor = 'black';
              break;
          }

          return {
            style: {
              fontSize: '12px',
              color: cellColor,
            },
          };
        }}
      />
    </Styles>
  );
};

export default SearchPoliciesTable;
