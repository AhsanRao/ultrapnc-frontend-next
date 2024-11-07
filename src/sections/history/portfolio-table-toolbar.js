import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function PortfolioTableToolbar({
  filters,
  onFilters,
  resCommOptions,
  constructionTypeOptions,
  riskLevelOptions,
  wildfireStatusOptions,
}) {
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterResComm = useCallback(
    (event) => {
      onFilters(
        'resComm',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterConstructionType = useCallback(
    (event) => {
      onFilters(
        'constructionType',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterFloodRisk = useCallback(
    (event) => {
      onFilters(
        'floodRisk',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterDroughtCondition = useCallback(
    (event) => {
      onFilters(
        'droughtCondition',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterWildfireStatus = useCallback(
    (event) => {
      onFilters(
        'wildfireStatus',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterEarthquakeAlert = useCallback(
    (event) => {
      onFilters(
        'earthquakeAlert',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const renderFilterControl = (label, value, handleChange, options, checked) => (
    <FormControl
      sx={{
        flexShrink: 0,
        width: { xs: 1, sm: 200 },
      }}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => selected.map((value) => value).join(', ')}
        MenuProps={{
          PaperProps: {
            sx: { maxHeight: 240 },
          },
        }}
      >
        {/* {options.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox disableRipple size="small" checked={checked.includes(option)} />
            {option}
          </MenuItem>
        ))} */}
      </Select>
    </FormControl>
  );

  return (
    <Box sx={{ p: 2.5 }}>
      
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2.5 }}>
        <TextField
          fullWidth
          value={filters.name}
          onChange={handleFilterName}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <IconButton onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>
      {/* First row - Basic filters */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems="center"
        spacing={2}

      >
        {renderFilterControl(
          'Res/Comm',
          filters.resComm,
          handleFilterResComm,
          resCommOptions,
          filters.resComm
        )}
        {/* {renderFilterControl(
          'Construction Type',
          filters.constructionType,
          handleFilterConstructionType,
          constructionTypeOptions,
          filters.constructionType
        )} */}
        {renderFilterControl(
          'Flood Risk',
          filters.floodRisk,
          handleFilterFloodRisk,
          riskLevelOptions,
          filters.floodRisk
        )}
        
      
        {renderFilterControl(
          'Drought Condition',
          filters.droughtCondition,
          handleFilterDroughtCondition,
          riskLevelOptions,
          filters.droughtCondition
        )}
        {renderFilterControl(
          'Wildfire Status',
          filters.wildfireStatus,
          handleFilterWildfireStatus,
          wildfireStatusOptions,
          filters.wildfireStatus
        )}
        {renderFilterControl(
          'Earthquake Alert',
          filters.earthquakeAlert,
          handleFilterEarthquakeAlert,
          riskLevelOptions,
          filters.earthquakeAlert
        )}
      </Stack>

      {/* Third row - Search bar */}
      

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            console.log('Print');
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            console.log('Export');
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>
    </Box>
  );
}

PortfolioTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  resCommOptions: PropTypes.array,
  constructionTypeOptions: PropTypes.array,
  riskLevelOptions: PropTypes.array,
  wildfireStatusOptions: PropTypes.array,
};