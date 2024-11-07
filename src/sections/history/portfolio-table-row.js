// import PropTypes from 'prop-types';
// import TableRow from '@mui/material/TableRow';
// import TableCell from '@mui/material/TableCell';
// import IconButton from '@mui/material/IconButton';
// import Iconify from 'src/components/iconify';
// import Checkbox from '@mui/material/Checkbox';

// export default function PortfolioTableRow({ 
//   row, 
//   selected, 
//   onSelectRow, 
//   onDeleteRow,
//   visibleColumns 
// }) {
//   const formatNumber = (value) => {
//     if (typeof value === 'number') {
//       return value.toLocaleString(undefined, {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       });
//     }
//     return value;
//   };

//   const renderCell = (columnId) => {
//     const value = row[columnId];
    
//     switch (columnId) {
//       case 'premium':
//       case 'deductible':
//       case 'limit':
//       case 'attachment':
//       case 'excess':
//       case 'valueAtRisk':
//         return `$${formatNumber(value)}`;
      
//       case 'participation':
//         return `${formatNumber(value)}%`;
      
//       case 'basement':
//         return value ? 'Yes' : 'No';
      
//       case 'latitude':
//       case 'longitude':
//       case 'elevation':
//       case 'coniferous_forest_proximity':
//       case 'body_of_water_proximity':
//       case 'hail_alley_proximity':
//       case 'fault_line_proximity':
//       case 'wildfire_risk_value':
//       case 'magnitude':
//         return formatNumber(value);
      
//       default:
//         return value;
//     }
//   };

//   return (
//     <TableRow hover selected={selected}>
//       <TableCell padding="checkbox">
//         <Checkbox checked={selected} onClick={onSelectRow} />
//       </TableCell>
      
//       {visibleColumns.map((columnId) => (
//         <TableCell 
//           key={columnId}
//           align={['premium', 'deductible', 'limit', 'attachment', 'participation', 
//                  'valueAtRisk', 'excess', 'latitude', 'longitude', 'elevation',
//                  'coniferous_forest_proximity', 'body_of_water_proximity',
//                  'hail_alley_proximity', 'fault_line_proximity',
//                  'wildfire_risk_value', 'magnitude'].includes(columnId) ? 'right' :
//                 columnId === 'basement' ? 'center' : 'left'}
//         >
//           {renderCell(columnId)}
//         </TableCell>
//       ))}

//       <TableCell align="right">
//         <IconButton color="error" onClick={() => onDeleteRow(row.id)}>
//           <Iconify icon="eva:trash-2-outline" />
//         </IconButton>
//       </TableCell>
//     </TableRow>
//   );
// }

// PortfolioTableRow.propTypes = {
//   row: PropTypes.object,
//   selected: PropTypes.bool,
//   onSelectRow: PropTypes.func,
//   onDeleteRow: PropTypes.func,
//   visibleColumns: PropTypes.arrayOf(PropTypes.string),
// };
// 
import { useState } from 'react';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles'; 
import { useSnackbar } from 'src/components/snackbar';

import Iconify from 'src/components/iconify';
import Checkbox from '@mui/material/Checkbox';
import axios from 'src/utils/axios';

const DETAIL_GROUPS = [
  {
    title: 'Basic Information',
    fields: [
      { id: 'code', label: 'Code' },
      { id: 'portfolioName', label: 'Portfolio' },
      { id: 'address', label: 'Address' },
      { id: 'street_address', label: 'Street Address' },
      { id: 'city', label: 'City' },
      { id: 'state', label: 'State' },
      { id: 'postal_code', label: 'Postal Code' },
      { id: 'country', label: 'Country' },
    ]
  },
  {
    title: 'Property Details',
    fields: [
      { id: 'resComm', label: 'Res/Comm' },
      { id: 'occupancy', label: 'Occupancy' },
      { id: 'constructionType', label: 'Construction Type' },
      { id: 'basement', label: 'Basement' },
    ]
  },
  {
    title: 'Financial Information',
    fields: [
      { id: 'premium', label: 'Premium', isCurrency: true },
      { id: 'deductible', label: 'Deductible', isCurrency: true },
      { id: 'limit', label: 'Limit', isCurrency: true },
      { id: 'attachment', label: 'Attachment', isCurrency: true },
      { id: 'participation', label: 'Participation', isPercentage: true },
      { id: 'valueAtRisk', label: 'Value at Risk', isCurrency: true },
      { id: 'excess', label: 'Excess', isCurrency: true },
    ]
  },
  {
    title: 'Geographic Information',
    fields: [
      { id: 'latitude', label: 'Latitude', isNumber: true },
      { id: 'longitude', label: 'Longitude', isNumber: true },
      { id: 'elevation', label: 'Elevation', isNumber: true },
    ]
  },
  {
    title: 'Risk Factors',
    fields: [
      { id: 'coniferous_forest_proximity', label: 'Forest Proximity', isNumber: true },
      { id: 'coniferous_forest_type', label: 'Forest Type' },
      { id: 'body_of_water_proximity', label: 'Water Proximity', isNumber: true },
      { id: 'hail_alley_proximity', label: 'Hail Proximity', isNumber: true },
      { id: 'fault_line_proximity', label: 'Fault Line Proximity', isNumber: true },
      { id: 'flood_risk_areas', label: 'Flood Risk' },
      { id: 'drought_condition', label: 'Drought Condition' },
      { id: 'flood_status', label: 'Flood Status' },
      { id: 'wildfire_status', label: 'Wildfire Status' },
      { id: 'landslide_susceptibility', label: 'Landslide Risk' },
      { id: 'wildfire_risk_value', label: 'Wildfire Risk', isNumber: true },
      { id: 'earthquake_alert', label: 'Earthquake Alert' },
      { id: 'magnitude', label: 'Magnitude', isNumber: true },
    ]
  }
];

export default function PortfolioTableRow({ 
  row, 
  selected, 
  onSelectRow, 
  onDeleteRow,
  visibleColumns,
  portfolios 
}) {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState(row.portfolioId);
  const { enqueueSnackbar } = useSnackbar();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
    handleMenuClose();
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleConfirmDelete = () => {
    onDeleteRow(row.id);
    handleCloseDelete();
  };

  const handleOpenEdit = () => {
    setOpenEdit(true);
    handleMenuClose();
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedPortfolio(row.portfolioId);
  };

  const handleUpdatePortfolio = async () => {
    try {
      await axios.patch(`/api/locations/${row.id}/`, { portfolio: selectedPortfolio });

      // Close the dialog
      handleCloseEdit();
      
      enqueueSnackbar('Location updated successfully', { variant: 'success' });


    } catch (error) {
      // Handle error
      console.error('Error updating portfolio:', error);
      enqueueSnackbar(error.message || 'Failed to delete location', { 
        variant: 'error',
      });
    }
  };

  const formatNumber = (value) => {
    if (typeof value === 'number') {
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return value;
  };

  const renderCell = (columnId) => {
    const value = row[columnId];

    switch (columnId) {
      case 'premium':
      case 'deductible':
      case 'limit':
      case 'attachment':
      case 'excess':
      case 'valueAtRisk':
        return `$${formatNumber(value)}`;

      case 'participation':
        return `${formatNumber(value)}%`;

      case 'basement':
        return value ? 'Yes' : 'No';

      case 'latitude':
      case 'longitude':
      case 'elevation':
      case 'coniferous_forest_proximity':
      case 'body_of_water_proximity':
      case 'hail_alley_proximity':
      case 'fault_line_proximity':
      case 'wildfire_risk_value':
      case 'magnitude':
        return formatNumber(value);

      default:
        return value;
    }
  };

  const renderDetailValue = (field, value) => {
    if (value == null) return '-';

    if (field.isCurrency) {
      return `$${formatNumber(value)}`;
    }
    if (field.isPercentage) {
      return `${formatNumber(value)}%`;
    }
    if (field.isNumber) {
      return formatNumber(value);
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value;
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        {visibleColumns.map((columnId) => (
          <TableCell 
            key={columnId}
            align={['premium', 'deductible', 'limit', 'attachment', 'participation', 
                   'valueAtRisk', 'excess', 'latitude', 'longitude', 'elevation',
                   'coniferous_forest_proximity', 'body_of_water_proximity',
                   'hail_alley_proximity', 'fault_line_proximity',
                   'wildfire_risk_value', 'magnitude'].includes(columnId) ? 'right' :
                  columnId === 'basement' ? 'center' : 'left'}
          >
            {renderCell(columnId)}
          </TableCell>
        ))}

        <TableCell align="right">
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <IconButton 
              color="primary" 
              onClick={handleOpenModal}
              sx={{ color: theme.palette.primary.main }}
            >
              <Iconify icon="eva:eye-fill" />
            </IconButton>
            <IconButton onClick={handleMenuOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenEdit}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit Portfolio
        </MenuItem>
        <MenuItem onClick={handleOpenDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this location? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="edit-dialog-title"
      >
        <DialogTitle id="edit-dialog-title">
          Change Portfolio
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Portfolio</InputLabel>
              <Select
                value={selectedPortfolio}
                label="Portfolio"
                onChange={(e) => setSelectedPortfolio(e.target.value)}
              >
                {portfolios.map((portfolio) => (
                  <MenuItem key={portfolio.id} value={portfolio.id}>
                    {portfolio.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button 
            onClick={handleUpdatePortfolio} 
            variant="contained"
            disabled={selectedPortfolio === row.portfolioId}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>
          Location Details
          <Typography variant="subtitle2" sx={{ mt: 1, color: 'text.secondary' }}>
            {row.address}
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ py: 1 }}>
            {DETAIL_GROUPS.map((group, index) => (
              <Box key={group.title} sx={{ mb: index !== DETAIL_GROUPS.length - 1 ? 3 : 0 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {group.title}
                </Typography>

                <Grid container spacing={2}>
                  {group.fields.map((field) => (
                    <Grid item xs={12} sm={6} md={4} key={field.id}>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {field.label}
                        </Typography>
                        <Typography>
                          {renderDetailValue(field, row[field.id])}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>

                {index !== DETAIL_GROUPS.length - 1 && (
                  <Divider sx={{ mt: 3 }} />
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

PortfolioTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
  portfolios: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })),
};