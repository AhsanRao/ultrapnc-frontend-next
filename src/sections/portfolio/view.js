'use client';

import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CardContent from '@mui/material/CardContent';
import { alpha } from '@mui/material/styles';
import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import Upload from 'src/components/upload/upload';
import ContactMap from '../contact/contact-map';
import { _mapContact } from 'src/_mock';
import PortfolioTable from './portfolio-table';

export default function PortfolioView() {
  const settings = useSettingsContext();
  const [files, setFiles] = useState([]);
  const [currentTab, setCurrentTab] = useState('table');

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      setFiles([
        ...files,
        ...acceptedFiles.map((newFile) =>
          Object.assign(newFile, {
            preview: URL.createObjectURL(newFile),
          })
        ),
      ]);
    },
    [files]
  );

  const handleRemoveFile = (inputFile) => {
    const filesFiltered = files.filter((fileFiltered) => fileFiltered !== inputFile);
    setFiles(filesFiltered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);


  // Mock data for the table
  const mockData = [
    {
      id: 1,
      code: 'ABC123',
      address: '123 Main St',
      resComm: 'Residential',
      occupancy: 'Single Family',
      constructionType: 'Wood Frame',
      premium: 1000,
      deductible: 500,
      limit: 250000,
      attach: 'N/A',
      partOf: 'N/A',
      valueAtRisk: 300000,
      basement: 'Yes',
      excess: 0,
      latitude: 40.7128,
      longitude: -74.006,
      elevation: 33,
      coniferousForestProximity: 5,
      bodyOfWaterProximity: 2,
      hailAlleyProximity: 10,
      faultLineProximity: 50,
    },
    {
      id: 2,
      code: 'MMSA',
      address: '123 Main St',
      resComm: 'Commercial',
      occupancy: 'Single Family',
      constructionType: 'Masonry',
      premium: 1000,
      deductible: 500,
      limit: 250000,
      attach: 'N/A',
      partOf: 'N/A',
      valueAtRisk: 300000,
      basement: 'Yes',
      excess: 0,
      latitude: 40.7128,
      longitude: -74.006,
      elevation: 33,
      coniferousForestProximity: 5,
      bodyOfWaterProximity: 2,
      hailAlleyProximity: 10,
      faultLineProximity: 50,
    },
    {
      id: 3,
      code: 'QWWasd12',
      address: '123 Main St',
      resComm: 'Residential',
      occupancy: 'Single Family',
      constructionType: 'Steel Frame',
      premium: 1000,
      deductible: 500,
      limit: 250000,
      attach: 'N/A',
      partOf: 'N/A',
      valueAtRisk: 300000,
      basement: 'Yes',
      excess: 0,
      latitude: 40.7128,
      longitude: -74.006,
      elevation: 33,
      coniferousForestProximity: 5,
      bodyOfWaterProximity: 2,
      hailAlleyProximity: 10,
      faultLineProximity: 50,
    },
  ];

  const renderContent = () => {
    if (currentTab === 'table') {
      return <PortfolioTable data={mockData} />;
    }
    if (currentTab === 'map') {
      return <ContactMap contacts={_mapContact} />;
    }
    return (
      <>
        <PortfolioTable data={mockData} />
        <Box sx={{ mt: 4 }}>
          <ContactMap contacts={_mapContact} />
        </Box>
      </>
    );
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
            files={files}
            onDrop={handleDropMultiFile}
            onRemove={handleRemoveFile}
            onRemoveAll={handleRemoveAllFiles}
            onUpload={() => console.info('ON UPLOAD')}
          />
        </CardContent>
      </Card>

      <Card>
        <Box sx={{ display: 'flex', justifyContent: 'center', px: 3, py: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
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

        {renderContent()}
      </Card>
    </Container>
  );
}
