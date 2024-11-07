import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import Checkbox from '@mui/material/Checkbox';

export default function PortfolioTableRow({ row, selected, onSelectRow, onDeleteRow }) {
  const formatNumber = (value) => {
    if (typeof value === 'number') {
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return value;
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      
      <TableCell>{row.code}</TableCell>
      <TableCell>{row.address}</TableCell>
      <TableCell>{row.street_address}</TableCell>
      <TableCell>{row.city}</TableCell>
      <TableCell>{row.state}</TableCell>
      <TableCell>{row.postal_code}</TableCell>
      <TableCell>{row.country}</TableCell>
      <TableCell>{row.resComm}</TableCell>
      <TableCell>{row.occupancy}</TableCell>
      <TableCell>{row.constructionType}</TableCell>
      <TableCell align="right">${formatNumber(row.premium)}</TableCell>
      <TableCell align="right">${formatNumber(row.deductible)}</TableCell>
      <TableCell align="right">${formatNumber(row.limit)}</TableCell>
      <TableCell align="right">${formatNumber(row.attachment)}</TableCell>
      <TableCell align="right">{formatNumber(row.participation)}%</TableCell>
      <TableCell align="right">${formatNumber(row.valueAtRisk)}</TableCell>
      <TableCell align="center">{row.basement ? 'Yes' : 'No'}</TableCell>
      <TableCell align="right">${formatNumber(row.excess)}</TableCell>
      <TableCell align="right">{formatNumber(row.latitude)}</TableCell>
      <TableCell align="right">{formatNumber(row.longitude)}</TableCell>
      <TableCell align="right">{formatNumber(row.elevation)}</TableCell>
      <TableCell align="right">{formatNumber(row.coniferous_forest_proximity)}</TableCell>
      <TableCell>{row.coniferous_forest_type}</TableCell>
      <TableCell align="right">{formatNumber(row.body_of_water_proximity)}</TableCell>
      <TableCell align="right">{formatNumber(row.hail_alley_proximity)}</TableCell>
      <TableCell align="right">{formatNumber(row.fault_line_proximity)}</TableCell>
      <TableCell>{row.ecoregion_name}</TableCell>
      <TableCell>{row.nri_census_tracts}</TableCell>
      <TableCell>{row.flood_risk_areas}</TableCell>
      <TableCell>{row.drought_condition}</TableCell>
      <TableCell>{row.flood_status}</TableCell>
      <TableCell>{row.wildfire_status}</TableCell>
      <TableCell>{row.landslide_susceptibility}</TableCell>
      <TableCell align="right">{formatNumber(row.wildfire_risk_value)}</TableCell>
      <TableCell>{row.earthquake_alert}</TableCell>
      <TableCell align="right">{formatNumber(row.magnitude)}</TableCell>
      <TableCell align="right">
        <IconButton color="error" onClick={() => onDeleteRow(row.id)}>
          <Iconify icon="eva:trash-2-outline" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

PortfolioTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};