import { useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Card,
  Tooltip,
  IconButton,
  Button,
} from '@mui/material';
import isEqual from 'lodash/isEqual';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import PortfolioTableRow from './portfolio-table-row';
import PortfolioTableToolbar from './portfolio-table-toolbar';
import PortfolioTableFiltersResult from './portfolio-table-filters-result';

const TABLE_HEAD = [
  { id: 'code', label: 'Code', align: 'left' },
  { id: 'address', label: 'Address', align: 'left' },
  { id: 'resComm', label: 'Res/Comm', align: 'left' },
  { id: 'occupancy', label: 'Occupancy', align: 'left' },
  { id: 'constructionType', label: 'Construction Type', align: 'left' },
  { id: 'premium', label: 'Premium', align: 'right' },
  { id: 'deductible', label: 'Deductible', align: 'right' },
  { id: 'limit', label: 'Limit', align: 'right' },
  { id: 'attach', label: 'Attach', align: 'left' },
  { id: 'partOf', label: 'Part/of', align: 'left' },
  { id: 'valueAtRisk', label: 'Value at Risk', align: 'right' },
  { id: 'basement', label: 'Basement', align: 'left' },
  { id: 'excess', label: 'Excess', align: 'right' },
  { id: 'latitude', label: 'Latitude', align: 'right' },
  { id: 'longitude', label: 'Longitude', align: 'right' },
  { id: 'elevation', label: 'Elevation', align: 'right' },
  { id: 'coniferousForestProximity', label: 'Coniferous Forest Proximity', align: 'right' },
  { id: 'bodyOfWaterProximity', label: 'Body of Water Proximity', align: 'right' },
  { id: 'hailAlleyProximity', label: 'Hail Alley Proximity', align: 'right' },
  { id: 'faultLineProximity', label: 'Fault Line Proximity', align: 'right' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  resComm: [],
  constructionType: [],
};

export default function PortfolioTable({ data }) {
  const table = useTable();

  const [tableData, setTableData] = useState(data);
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <Card>
      <PortfolioTableToolbar
        filters={filters}
        onFilters={handleFilters}
        resCommOptions={['Residential', 'Commercial']}
        constructionTypeOptions={['Wood Frame', 'Masonry', 'Steel Frame']}
      />

      {canReset && (
        <PortfolioTableFiltersResult
          filters={filters}
          onFilters={handleFilters}
          onResetFilters={handleResetFilters}
          results={dataFiltered.length}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <TableSelectedAction
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={tableData.length}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              tableData.map((row) => row.id)
            )
          }
          action={
            <Tooltip title="Delete">
              <IconButton color="primary" onClick={handleDeleteRows}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          }
        />

        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <PortfolioTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                  />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={dataFiltered.length}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </Card>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name, resComm, constructionType } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (item) => item.code.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (resComm.length) {
    inputData = inputData.filter((item) => resComm.includes(item.resComm));
  }

  if (constructionType.length) {
    inputData = inputData.filter((item) => constructionType.includes(item.constructionType));
  }

  return inputData;
}