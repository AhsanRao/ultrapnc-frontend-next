import { useState, useCallback } from 'react';
import {
  Table,
  Box,
  Button,
  Menu,
  MenuItem,
  Divider,
  TableBody,
  TableContainer,
  TableRow,
  Card,
  FormControlLabel,
Checkbox,
  FormGroup,
  Tooltip,
  IconButton,
} from '@mui/material';
import isEqual from 'lodash/isEqual';
import { useSnackbar } from 'src/components/snackbar';
import axios from 'src/utils/axios';

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
  // { id: 'portfolioName', label: 'Portfolio', align: 'left' },
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

const ALL_COLUMNS = [
  { id: 'code', label: 'Code', align: 'left' },
  // { id: 'portfolioName', label: 'Portfolio', align: 'left' },
  { id: 'address', label: 'Address', align: 'left' },
  { id: 'resComm', label: 'Res/Comm', align: 'left' },
  { id: 'constructionType', label: 'Construction Type', align: 'left' },
  { id: 'premium', label: 'Premium', align: 'right' },
  { id: 'valueAtRisk', label: 'Value at Risk', align: 'right' },
  { id: 'flood_risk_areas', label: 'Flood Risk', align: 'left' },
  { id: 'street_address', label: 'Street Address', align: 'left' },
  { id: 'city', label: 'City', align: 'left' },
  { id: 'state', label: 'State', align: 'left' },
  { id: 'postal_code', label: 'Postal Code', align: 'left' },
  { id: 'country', label: 'Country', align: 'left' },
  { id: 'occupancy', label: 'Occupancy', align: 'left' },
  { id: 'deductible', label: 'Deductible', align: 'right' },
  { id: 'limit', label: 'Limit', align: 'right' },
  { id: 'attachment', label: 'Attachment', align: 'right' },
  { id: 'participation', label: 'Participation', align: 'right' },
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
  { id: 'drought_condition', label: 'Drought', align: 'left' },
  { id: 'flood_status', label: 'Flood Status', align: 'left' },
  { id: 'wildfire_status', label: 'Wildfire Status', align: 'left' },
  { id: 'landslide_susceptibility', label: 'Landslide Risk', align: 'left' },
  { id: 'wildfire_risk_value', label: 'Wildfire Risk', align: 'right' },
  { id: 'earthquake_alert', label: 'Earthquake Alert', align: 'left' },
  { id: 'magnitude', label: 'Magnitude', align: 'right' },
];

// Default visible columns (first 8)
const DEFAULT_VISIBLE_COLUMNS = [
  'code',
  // 'portfolioName',
  'address',
  'resComm',
  'constructionType',
  'premium',
  'valueAtRisk',
  'flood_risk_areas',
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

export default function PortfolioTable({ data, currentPortfolio, portfolios }) {
  const table = useTable();
  const { enqueueSnackbar } = useSnackbar();

  const [tableData, setTableData] = useState(data);
  const [filters, setFilters] = useState(defaultFilters);
  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_VISIBLE_COLUMNS);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const applyFilter = useCallback(({ inputData, comparator, filters }) => {
    const { name, resComm, constructionType, floodRisk, droughtCondition, wildfireStatus, earthquakeAlert } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    // Filter by current portfolio if selected
    if (currentPortfolio && currentPortfolio !== 'all') {
      inputData = inputData.filter((item) => item.portfolioId === currentPortfolio);
    }

    // Search across all fields
    if (name) {
      const searchTerm = name.toLowerCase();
      inputData = inputData.filter((item) => {
        const containsSearchTerm = (value) => {
          if (value == null) return false;
          return String(value).toLowerCase().indexOf(searchTerm) !== -1;
        };

        const excludedFields = ['id', 'created_at', 'updated_at', 'portfolio'];

        return Object.entries(item).some(([key, value]) => {
          if (excludedFields.includes(key)) return false;
          
          if (typeof value === 'object') {
            return containsSearchTerm(JSON.stringify(value));
          }

          if (typeof value === 'boolean') {
            return searchTerm === String(value);
          }

          if (typeof value === 'number') {
            const numericSearch = Number(searchTerm);
            if (!Number.isNaN(numericSearch)) {
              return value === numericSearch;
            }
            return containsSearchTerm(value);
          }

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
  }, [currentPortfolio]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });
  
  const handleColumnsMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleColumnsMenuClose = () => {
    setAnchorEl(null);
  };

  const handleColumnToggle = (columnId) => {
    setVisibleColumns((prev) => {
      if (prev.includes(columnId)) {
        return prev.filter(id => id !== columnId);
      }
      return [...prev, columnId];
    });
  };
  
  // Get current visible columns configuration
  const visibleTableHead = ALL_COLUMNS.filter(column => 
    visibleColumns.includes(column.id)
  );

  // Add fixed width for actions column
  visibleTableHead.push({ id: '', width: 88 });

  // Reset columns to default
  const handleResetColumns = () => {
    setVisibleColumns(DEFAULT_VISIBLE_COLUMNS);
  };

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
  
  const handleDeleteRow = useCallback(async (id) => {
      try {
        setLoading(true);
        
        // Make API call to delete the location
        await axios.delete(`/api/locations/${id}/`);
  
        // Update local state by filtering out the deleted row
        setTableData((prevData) => prevData.filter((row) => row.id !== id));
  
        // Show success message
        enqueueSnackbar('Location deleted successfully', { variant: 'success' });
  
        // Update table pagination if necessary
        if (tableData.length === 1 && table.page > 0) {
          table.onChangePage(null, table.page - 1);
        }
  
        // If there were selected rows, update the selection
        if (table.selected.includes(id)) {
          const newSelected = table.selected.filter((selectedId) => selectedId !== id);
          table.onSelectRow(newSelected);
        }
  
      } catch (error) {
        console.error('Error deleting location:', error);
        
        // Show error message
        enqueueSnackbar(error.message || 'Failed to delete location', { 
          variant: 'error',
        });
  
      } finally {
        setLoading(false);
      }
    }, [enqueueSnackbar, table, tableData.length]);
  
    // Handle bulk delete
    const handleDeleteRows = useCallback(async (selectedIds) => {
      try {
        setLoading(true);
  
        // Make API calls to delete multiple locations
        await Promise.all(
          selectedIds.map((id) => axios.delete(`/api/locations/${id}`))
        );
  
        // Update local state by filtering out all deleted rows
        setTableData((prevData) => 
          prevData.filter((row) => !selectedIds.includes(row.id))
        );
  
        // Clear selection
        table.onSelectRow([]);
  
        // Show success message
        enqueueSnackbar('Locations deleted successfully', { variant: 'success' });
  
        // Update table pagination if necessary
        const remainingRows = tableData.length - selectedIds.length;
        const newLastPage = Math.ceil(remainingRows / table.rowsPerPage) - 1;
        if (table.page > newLastPage && newLastPage >= 0) {
          table.onChangePage(null, newLastPage);
        }
  
      } catch (error) {
        console.error('Error deleting locations:', error);
        
        // Show error message
        enqueueSnackbar(error.message || 'Failed to delete locations', { 
          variant: 'error',
        });
  
      } finally {
        setLoading(false);
      }
    }, [enqueueSnackbar, table, tableData.length]);
    
  // const handleDeleteRows = useCallback(() => {
  //   const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
  //   setTableData(deleteRows);

  //   // table.onUpdatePageDeleteRows({
  //   //   totalRows: tableData.length,
  //   //   totalRowsInPage: dataInPage.length,
  //   //   totalRowsFiltered: dataFiltered.length,
  //   // });
  // }, [table, tableData]);


  return (
    <Card>
      <PortfolioTableToolbar
        filters={filters}
        onFilters={handleFilters}
        resCommOptions={['Residential', 'Commercial']}
        constructionTypeOptions={['WOOD', 'MASONRY', 'STEEL', 'CONCRETE']}
        riskLevelOptions={['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']}
        wildfireStatusOptions={['INACTIVE', 'ACTIVE', 'CRITICAL']}
      />

      {canReset && (
        <PortfolioTableFiltersResult
          filters={filters}
          onFilters={handleFilters}
          onResetFilters={() => setFilters(defaultFilters)}
          results={dataFiltered.length}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}
      
      {/* Column Selection Button */}
      <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          color="primary"
          startIcon={<Iconify icon="mdi:table-column" />}
          onClick={handleColumnsMenuOpen}
        >
          Columns
        </Button>
      </Box>

      {/* Columns Selection Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleColumnsMenuClose}
        PaperProps={{
          sx: { maxHeight: 300, width: 250 },
        }}
      >
        <MenuItem>
          <Button 
            color="inherit" 
            onClick={handleResetColumns}
            startIcon={<Iconify icon="mdi:refresh" />}
          >
            Reset to Default
          </Button>
        </MenuItem>
        <Divider />
        <Box sx={{ p: 2 }}>
          <FormGroup>
            {ALL_COLUMNS.map((column) => (
              <FormControlLabel
                key={column.id}
                control={
                  <Checkbox
                    checked={visibleColumns.includes(column.id)}
                    onChange={() => handleColumnToggle(column.id)}
                  />
                }
                label={column.label}
              />
            ))}
          </FormGroup>
        </Box>
      </Menu>

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
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
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={visibleTableHead}
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
                    visibleColumns={visibleColumns}
                    portfolios={portfolios} // Add this prop
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

