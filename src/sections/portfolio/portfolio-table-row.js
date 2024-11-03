import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import Checkbox from '@mui/material/Checkbox';

export default function PortfolioTableRow({ row, selected, onSelectRow, onDeleteRow }) {
  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      
      <TableCell>{row.code}</TableCell>
      <TableCell>{row.address}</TableCell>
      <TableCell>{row.resComm}</TableCell>
      <TableCell>{row.occupancy}</TableCell>
      <TableCell>{row.constructionType}</TableCell>
      <TableCell align="right">{row.premium}</TableCell>
      <TableCell align="right">{row.deductible}</TableCell>
      <TableCell align="right">{row.limit}</TableCell>
      <TableCell>{row.attach}</TableCell>
      <TableCell>{row.partOf}</TableCell>
      <TableCell align="right">{row.valueAtRisk}</TableCell>
      <TableCell>{row.basement}</TableCell>
      <TableCell align="right">{row.excess}</TableCell>
      <TableCell align="right">{row.latitude}</TableCell>
      <TableCell align="right">{row.longitude}</TableCell>
      <TableCell align="right">{row.elevation}</TableCell>
      <TableCell align="right">{row.coniferousForestProximity}</TableCell>
      <TableCell align="right">{row.bodyOfWaterProximity}</TableCell>
      <TableCell align="right">{row.hailAlleyProximity}</TableCell>
      <TableCell align="right">{row.faultLineProximity}</TableCell>

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