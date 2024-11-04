'use client';

import { useState, useCallback, useEffect } from 'react';
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
import Papa from 'papaparse';
import axios, { endpoints } from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import Loader from './loader';



export default function PortfolioView() {
  const settings = useSettingsContext();
  const [files, setFiles] = useState([]);
  const [currentTab, setCurrentTab] = useState('table');
  const [csvData, setCsvData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [loader, setLoader] = useState(false);

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

  const REFRESH_KEY = 'refreshToken';

  const handleParseComplete = async (results, name) => {
    const refreshToken = sessionStorage.getItem(REFRESH_KEY);
    console.log(refreshToken, 'refreshToken', results.data)
    const location = results.data.map((row) => ({
      code: row.code,
      address: row.code || "",
      city: row.city,
      state: row.state,
      postal_code: row.postal_code,
      country: row.country,
      occupancy: row.occupancy,
      construction_type: row.construction_type,
      premium: Number(row.premium.replace(/\$/g, "")),
      deductible: Number(row.deductible),
      limit: Number(row.limit),
      attach: Number(row.attach),
      basement: row.basement === true || row.basement === 'true',
      excess: Number(row.excess)
    }))
    console.log(location, 'location')
    // Map parsed CSV data to the required payload structure
    const payload = {
      portfolio_name: name,
      locations: location,
    };

    try {
      const response = await axios.post(endpoints.quickPortfoli, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response, 'responsesssssss')
      setLoader(false)
      setCsvData(response?.data?.locations);
      enqueueSnackbar(response?.data?.message);
    } catch (error) {
      setLoader(false)
      console.error("API error:", error);
    }
  };



  const handleUploadFile = () => {
    setLoader(true)
    if (files.length > 0) {
      files.forEach((file) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => handleParseComplete(results, file.name),
          error(error) {
            console.error("Parsing error:", error.message);
          },
        });
      });
    }
  };


  // Mock data for the table
  // const mockData = [
  //   {
  //     id: 1,
  //     code: 'ABC123',
  //     address: '123 Main St',
  //     resComm: 'Residential',
  //     occupancy: 'Single Family',
  //     constructionType: 'Wood Frame',
  //     premium: 1000,
  //     deductible: 500,
  //     limit: 250000,
  //     attach: 'N/A',
  //     partOf: 'N/A',
  //     valueAtRisk: 300000,
  //     basement: 'Yes',
  //     excess: 0,
  //     latitude: 40.7128,
  //     longitude: -74.006,
  //     elevation: 33,
  //     coniferousForestProximity: 5,
  //     bodyOfWaterProximity: 2,
  //     hailAlleyProximity: 10,
  //     faultLineProximity: 50,
  //   },
  //   {
  //     id: 2,
  //     code: 'MMSA',
  //     address: '123 Main St',
  //     resComm: 'Commercial',
  //     occupancy: 'Single Family',
  //     constructionType: 'Masonry',
  //     premium: 1000,
  //     deductible: 500,
  //     limit: 250000,
  //     attach: 'N/A',
  //     partOf: 'N/A',
  //     valueAtRisk: 300000,
  //     basement: 'Yes',
  //     excess: 0,
  //     latitude: 40.7128,
  //     longitude: -74.006,
  //     elevation: 33,
  //     coniferousForestProximity: 5,
  //     bodyOfWaterProximity: 2,
  //     hailAlleyProximity: 10,
  //     faultLineProximity: 50,
  //   },
  //   {
  //     id: 3,
  //     code: 'QWWasd12',
  //     address: '123 Main St',
  //     resComm: 'Residential',
  //     occupancy: 'Single Family',
  //     constructionType: 'Steel Frame',
  //     premium: 1000,
  //     deductible: 500,
  //     limit: 250000,
  //     attach: 'N/A',
  //     partOf: 'N/A',
  //     valueAtRisk: 300000,
  //     basement: 'Yes',
  //     excess: 0,
  //     latitude: 40.7128,
  //     longitude: -74.006,
  //     elevation: 33,
  //     coniferousForestProximity: 5,
  //     bodyOfWaterProximity: 2,
  //     hailAlleyProximity: 10,
  //     faultLineProximity: 50,
  //   },
  // ];

  let mapContact = csvData?.map((x) => {
    return {
      latlng: [x.longitude, x.latitude],
      address: x.address,
      phoneNumber: x.phoneNumber,
    }
  })

  const renderContent = () => {
    if (currentTab === 'table') {
      return <PortfolioTable data={csvData} />;
    }
    if (currentTab === 'map') {
      return <ContactMap contacts={mapContact} />;
    }
    return (
      <>
        <PortfolioTable data={csvData} />
        <Box sx={{ mt: 4 }}>
          <ContactMap contacts={mapContact} />
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
            onUpload={() => handleUploadFile()}
          />
        </CardContent>
      </Card>
      <Loader />
      {loader ? <Loader /> : null}
      {
        csvData !== null && !loader ?
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
          : null
      }

    </Container>
  );
}
