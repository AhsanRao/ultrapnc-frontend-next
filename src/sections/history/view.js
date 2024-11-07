'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import axios from 'src/utils/axios';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ContactMap from './portfolio-map';
import PortfolioTable from './portfolio-table';

export default function PortfolioView() {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [currentTab, setCurrentTab] = useState('table');
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapContacts, setMapContacts] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState('all');

  const transformLocations = (locations, portfolioName) => 
    locations.map(location => ({
      id: location.id,
      code: location.code,
      address: location.address,
      street_address: location.street_address,
      city: location.city,
      state: location.state,
      postal_code: location.postal_code,
      country: location.country,
      resComm: location.occupancy === 'RES' ? 'Residential' : 'Commercial',
      occupancy: location.occupancy,
      constructionType: location.construction_type,
      premium: parseFloat(location.premium),
      deductible: parseFloat(location.deductible),
      limit: parseFloat(location.limit),
      attachment: parseFloat(location.attachment),
      participation: parseFloat(location.participation),
      valueAtRisk: parseFloat(location.value_at_risk),
      basement: location.basement,
      excess: parseFloat(location.excess),
      latitude: parseFloat(location.latitude),
      longitude: parseFloat(location.longitude),
      elevation: parseFloat(location.elevation),
      coniferous_forest_proximity: parseFloat(location.coniferous_forest_proximity),
      coniferous_forest_type: location.coniferous_forest_type,
      body_of_water_proximity: parseFloat(location.body_of_water_proximity),
      hail_alley_proximity: parseFloat(location.hail_alley_proximity),
      fault_line_proximity: parseFloat(location.fault_line_proximity),
      ecoregion_name: location.ecoregion_name,
      nri_census_tracts: location.nri_census_tracts,
      flood_risk_areas: location.flood_risk_areas,
      drought_condition: location.drought_condition,
      flood_status: location.flood_status,
      wildfire_status: location.wildfire_status,
      landslide_susceptibility: location.landslide_susceptibility,
      wildfire_risk_value: parseFloat(location.wildfire_risk_value),
      earthquake_alert: location.earthquake_alert,
      magnitude: parseFloat(location.magnitude),
      portfolioName,
      portfolioId: location.portfolio
    }));

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await axios.get('/api/portfolios/');
        setPortfolios(response.data);
        
        // Transform all locations
        const allLocations = response.data.flatMap(portfolio => 
          transformLocations(portfolio.locations, portfolio.name)
        );

        // Transform data for map view
        const mapData = allLocations.map(loc => ({
          id: loc.id,
          code: loc.code,
          address: loc.address,
          latitude: loc.latitude,
          longitude: loc.longitude,
          value_at_risk: loc.valueAtRisk,
          construction_type: loc.constructionType,
          occupancy: loc.occupancy,
          flood_risk_areas: loc.flood_risk_areas,
          portfolioName: loc.portfolioName
        }));

        setTableData(allLocations);
        setMapContacts(mapData);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
        enqueueSnackbar('Error fetching portfolio data', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [enqueueSnackbar]);

  const handlePortfolioChange = (event) => {
    const newValue = event.target.value;
    setSelectedPortfolio(newValue);
    
    if (newValue === 'all') {
      const allLocations = portfolios.flatMap(portfolio => 
        transformLocations(portfolio.locations, portfolio.name)
      );
      setTableData(allLocations);
      setMapContacts(allLocations.map(loc => ({
        id: loc.id,
        code: loc.code,
        address: loc.address,
        latitude: loc.latitude,
        longitude: loc.longitude,
        value_at_risk: loc.valueAtRisk,
        construction_type: loc.constructionType,
        occupancy: loc.occupancy,
        flood_risk_areas: loc.flood_risk_areas,
        portfolioName: loc.portfolioName
      })));
    } else {
      const selectedPortfolioData = portfolios.find(p => p.id === newValue);
      if (selectedPortfolioData) {
        const filteredLocations = transformLocations(
          selectedPortfolioData.locations, 
          selectedPortfolioData.name
        );
        setTableData(filteredLocations);
        setMapContacts(filteredLocations.map(loc => ({
          id: loc.id,
          code: loc.code,
          address: loc.address,
          latitude: loc.latitude,
          longitude: loc.longitude,
          value_at_risk: loc.valueAtRisk,
          construction_type: loc.constructionType,
          occupancy: loc.occupancy,
          flood_risk_areas: loc.flood_risk_areas,
          portfolioName: loc.portfolioName
        })));
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Portfolio"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Portfolio' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <Box sx={{ px: 3, py: 3 }}>
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Select Portfolio</InputLabel>
              <Select
                value={selectedPortfolio}
                label="Select Portfolio"
                onChange={handlePortfolioChange}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="all">All Portfolios</MenuItem>
                {portfolios.map((portfolio) => (
                  <MenuItem key={portfolio.id} value={portfolio.id}>
                    {portfolio.name} ({portfolio.locations.length} locations)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Tabs
              value={currentTab}
              onChange={(e, newValue) => setCurrentTab(newValue)}
              sx={{
                px: 2,
                '& .MuiTab-root': {
                  px: 3,
                  py: 2,
                  mx: 2,
                  fontSize: '0.9rem',
                },
                '& .MuiTabs-indicator': {
                  height: 2,
                },
                boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
              }}
            >
              <Tab value="table" label="Table" />
              <Tab value="map" label="Map" />
              <Tab value="both" label="Both" />
            </Tabs>
          </Box>
        </Box>

        {currentTab === 'table' && <PortfolioTable data={tableData} currentPortfolio={selectedPortfolio}   portfolios={portfolios} // Add this prop
 />}
        {currentTab === 'map' && <ContactMap contacts={mapContacts} />}
        {currentTab === 'both' && (
          <>
            <PortfolioTable 
              data={tableData} 
              currentPortfolio={selectedPortfolio}
              portfolios={portfolios} // Add this
            />            
            <Box sx={{ mt: 4 }}>
              <ContactMap contacts={mapContacts} />
            </Box>
          </>
        )}
      </Card>
    </Container>
  );
}