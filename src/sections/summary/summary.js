'use client';

import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';

import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import Upload from 'src/components/upload/upload';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import axios, { endpoints } from 'src/utils/axios';
import { paths } from 'src/routes/paths';

import ContactMap from './portfolio-map';
import PortfolioTable from './portfolio-table';

// Helper to parse CSV considering possible line breaks within fields
const parseCSV = (text) => {
  const result = [];
  let row = [];
  let currentField = '';
  let inQuotes = false;
  
  // Normalize line endings
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  for (let i = 0; i < normalizedText.length; i++) {
    const char = normalizedText[i];
    const nextChar = normalizedText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentField.trim());
      currentField = '';
    } else if (char === '\n' && !inQuotes) {
      row.push(currentField.trim());
      if (row.some(field => field !== '')) {
        result.push(row);
      }
      row = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  
  if (currentField || row.length > 0) {
    row.push(currentField.trim());
    if (row.some(field => field !== '')) {
      result.push(row);
    }
  }

  return result;
};

export default function PortfolioView() {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [files, setFiles] = useState([]);
  const [currentTab, setCurrentTab] = useState('table');
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapContacts, setMapContacts] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState('all');
  const [portfolios, setPortfolios] = useState([]);

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file?.type !== 'text/csv') {
        enqueueSnackbar('Please upload a CSV file', { variant: 'error' });
        return;
      }

      setFiles([...files, ...acceptedFiles.map((newFile) =>
        Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        })
      )]);
    },
    [files, enqueueSnackbar]
  );

  const handleUpload = async () => {
    if (!files.length) {
      enqueueSnackbar('Please upload a CSV file first', { variant: 'warning' });
      return;
    }

    setLoading(true);
    const file = files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const text = reader.result;
        const rows = parseCSV(text);
        
        // Get addresses from CSV, skipping header row
        const addresses = rows.slice(1)
          .map(row => row[0]?.trim())
          .filter(address => address); // Remove empty addresses

        if (!addresses.length) {
          throw new Error('No valid addresses found in the CSV file');
        }

        const payload = {
          portfolio_name: file.name.replace('.csv', ''),
          addresses
        };

        const response = await axios.post(endpoints.quickPortfolio, payload);

        if (response.data.success) {
          const transformedData = response.data.locations.map(location => ({
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
          }));

          setTableData(transformedData);
         

          const mapContactsData = response.data.locations.map(loc => ({
                  id: loc.id,
                  code: loc.code,
                  address: loc.address,
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                  value_at_risk: loc.value_at_risk,
                  construction_type: loc.construction_type,
                  occupancy: loc.occupancy,
                  flood_risk_areas: loc.flood_risk_areas
                }));
          
                // setTableData(transformedData);
                setMapContacts(mapContactsData);
 console.log('Map Contacts Data:', mapContactsData);
          enqueueSnackbar('Portfolio created successfully!');
          setFiles([]);
        }
      } catch (error) {
        console.error('Error processing CSV:', error);
        enqueueSnackbar(error.message || 'Error processing CSV file', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  const handleRemoveFile = (inputFile) => {
    const filesFiltered = files.filter((fileFiltered) => fileFiltered !== inputFile);
    setFiles(filesFiltered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
    setTableData([]);
    setMapContacts([]);
  };

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


 

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Portfolio"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Portfolio' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card sx={{ mb: 5 }}>
        <CardContent>
          <Upload
            multiple
            accept=".csv"
            files={files}
            onDrop={handleDropMultiFile}
            onRemove={handleRemoveFile}
            onRemoveAll={handleRemoveAllFiles}
            onUpload={handleUpload}
          />
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card>
          <Box sx={{ display: 'flex', justifyContent: 'center', px: 3, py: 3 }}>
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

          {currentTab === 'table' && <PortfolioTable 
              data={tableData} 
              currentPortfolio={selectedPortfolio}
              portfolios={portfolios} 
            /> }
          {currentTab === 'map' && <ContactMap contacts={mapContacts} />}
          {currentTab === 'both' && (
            <>
              <PortfolioTable 
              data={tableData} 
              currentPortfolio={selectedPortfolio}
              portfolios={portfolios}
            /> 
              <Box sx={{ mt: 4 }}>
                <ContactMap contacts={mapContacts} />
              </Box>
            </>
          )}
        </Card>
      )}
    </Container>
  );
}