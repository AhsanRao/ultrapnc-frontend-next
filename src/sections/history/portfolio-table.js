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
  { id: 'street_address', label: 'Street Address', align: 'left' },
  { id: 'city', label: 'City', align: 'left' },
  { id: 'state', label: 'State', align: 'left' },
  { id: 'postal_code', label: 'Postal Code', align: 'left' },
  { id: 'country', label: 'Country', align: 'left' },
  { id: 'resComm', label: 'Res/Comm', align: 'left' },
  { id: 'occupancy', label: 'Occupancy', align: 'left' },
  { id: 'constructionType', label: 'Construction Type', align: 'left' },
  { id: 'premium', label: 'Premium', align: 'right' },
  { id: 'deductible', label: 'Deductible', align: 'right' },
  { id: 'limit', label: 'Limit', align: 'right' },
  { id: 'attachment', label: 'Attachment', align: 'right' },
  { id: 'participation', label: 'Participation', align: 'right' },
  { id: 'valueAtRisk', label: 'Value at Risk', align: 'right' },
  { id: 'basement', label: 'Basement', align: 'center' },
  { id: 'excess', label: 'Excess', align: 'right' },
  { id: 'latitude', label: 'Latitude', align: 'right' },
  { id: 'longitude', label: 'Longitude', align: 'right' },
  { id: 'elevation', label: 'Elevation', align: 'right' },
  { id: 'coniferous_forest_proximity', label: 'Forest Proximity', align: 'right' },
  { id: 'coniferous_forest_type', label: 'Forest Type', align: 'left' },
  { id: 'body_of_water_proximity', label: 'Water Proximity', align: 'right' },
  { id: 'hail_alley_proximity', label: 'Hail Proximity', align: 'right' },
  { id: 'fault_line_proximity', label: 'Fault Line Proximity', align: 'right' },
  { id: 'ecoregion_name', label: 'Ecoregion', align: 'left' },
  { id: 'nri_census_tracts', label: 'NRI Census', align: 'left' },
  { id: 'flood_risk_areas', label: 'Flood Risk', align: 'left' },
  { id: 'drought_condition', label: 'Drought', align: 'left' },
  { id: 'flood_status', label: 'Flood Status', align: 'left' },
  { id: 'wildfire_status', label: 'Wildfire Status', align: 'left' },
  { id: 'landslide_susceptibility', label: 'Landslide Risk', align: 'left' },
  { id: 'wildfire_risk_value', label: 'Wildfire Risk', align: 'right' },
  { id: 'earthquake_alert', label: 'Earthquake Alert', align: 'left' },
  { id: 'magnitude', label: 'Magnitude', align: 'right' },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  resComm: [],
  constructionType: [],
  floodRisk: [],
  droughtCondition: [],
  wildfireStatus: [],
  earthquakeAlert: [],
};

export default function PortfolioTable({ data }) {
  const table = useTable();

  const [tableData, setTableData] = useState(data);
  const [filters, setFilters] = useState(defaultFilters);

  function applyFilter({ inputData, comparator, filters }) {
      const { name, resComm, constructionType, floodRisk, droughtCondition, wildfireStatus, earthquakeAlert } = filters;
  
      const stabilizedThis = inputData.map((el, index) => [el, index]);
  
      stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
      });
  
      inputData = stabilizedThis.map((el) => el[0]);
  
      // Search across all fields
      if (name) {
        const searchTerm = name.toLowerCase();
        inputData = inputData.filter((item) => {
          // Helper function to safely convert any value to string and check if it contains search term
          const containsSearchTerm = (value) => {
            if (value == null) return false;
            return String(value).toLowerCase().indexOf(searchTerm) !== -1;
          };
  
          // Exclude these fields from search
          const excludedFields = ['id', 'created_at', 'updated_at', 'portfolio'];
  
          // Check all object properties
          return Object.entries(item).some(([key, value]) => {
            // Skip excluded fields
            if (excludedFields.includes(key)) return false;
  
            // Handle nested objects if any
            if (typeof value === 'object') {
              return containsSearchTerm(JSON.stringify(value));
            }
  
            // Handle boolean values
            if (typeof value === 'boolean') {
              return searchTerm === 'true' || searchTerm === 'false' 
                ? searchTerm === String(value)
                : false;
            }
  
            // Handle numeric values
            if (typeof value === 'number') {
              // If the search term is a valid number, do an exact match
              const numericSearch = Number(searchTerm);
              if (!Number.isNaN(numericSearch)) {
                return value === numericSearch;
              }
              // Otherwise, convert to string and search
              return containsSearchTerm(value);
            }
  
            // Default string search
            return containsSearchTerm(value);
          });
        });
      }
  
      // Apply other filters
      if (resComm.length) {
        inputData = inputData.filter((item) => resComm.includes(item.resComm));
      }
  
      if (constructionType.length) {
        inputData = inputData.filter((item) => constructionType.includes(item.constructionType));
      }
  
      if (floodRisk.length) {
        inputData = inputData.filter((item) => floodRisk.includes(item.flood_risk_areas));
      }
  
      if (droughtCondition.length) {
        inputData = inputData.filter((item) => droughtCondition.includes(item.drought_condition));
      }
  
      if (wildfireStatus.length) {
        inputData = inputData.filter((item) => wildfireStatus.includes(item.wildfire_status));
      }
  
      if (earthquakeAlert.length) {
        inputData = inputData.filter((item) => earthquakeAlert.includes(item.earthquake_alert));
      }
  
      return inputData;
    }
  
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
        resCommOptions={['RES', 'COM']}
        constructionTypeOptions={['WOOD', 'MASONRY', 'STEEL', 'CONCRETE']}
        riskLevelOptions={['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']}
        wildfireStatusOptions={['INACTIVE', 'ACTIVE', 'CRITICAL']}
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
  if (filters.floodRisk.length) {
    inputData = inputData.filter((item) => filters.floodRisk.includes(item.flood_risk_areas));
  }
  
  if (filters.droughtCondition.length) {
    inputData = inputData.filter((item) => filters.droughtCondition.includes(item.drought_condition));
  }
  
  if (filters.wildfireStatus.length) {
    inputData = inputData.filter((item) => filters.wildfireStatus.includes(item.wildfire_status));
  }
  
  if (filters.earthquakeAlert.length) {
    inputData = inputData.filter((item) => filters.earthquakeAlert.includes(item.earthquake_alert));
  }

  return inputData;
}