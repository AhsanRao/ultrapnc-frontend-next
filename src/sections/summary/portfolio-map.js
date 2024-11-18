import Map from 'react-map-gl';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';

import { MAPBOX_API } from 'src/config-global';

import Iconify from 'src/components/iconify';
import { MapPopup, MapMarker, MapControl } from 'src/components/map';

const StyledRoot = styled('div')(({ theme }) => ({
  zIndex: 0,
  height: 560,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none',
  },
}));

export default function ContactMap({ contacts }) {
  const theme = useTheme();
  const lightMode = theme.palette.mode === 'light';
  const [popupInfo, setPopupInfo] = useState(null);
  const [validContacts, setValidContacts] = useState([]);

  useEffect(() => {
    if (contacts && Array.isArray(contacts)) {
      const filtered = contacts.filter(
        contact => 
          contact &&
          !isNaN(parseFloat(contact.latitude)) && 
          !isNaN(parseFloat(contact.longitude))
      );
      setValidContacts(filtered);
    }
  }, [contacts]);

  const getCenterCoordinates = () => {
    if (!validContacts.length) {
      return { latitude: 39.8283, longitude: -98.5795 }; // Default to center of USA
    }

    const sumLat = validContacts.reduce((sum, contact) => sum + parseFloat(contact.latitude), 0);
    const sumLng = validContacts.reduce((sum, contact) => sum + parseFloat(contact.longitude), 0);
    
    return {
      latitude: sumLat / validContacts.length,
      longitude: sumLng / validContacts.length
    };
  };

  const centerCoords = getCenterCoordinates();

  return (
    <StyledRoot>
      <Map
        initialViewState={{
          latitude: centerCoords.latitude,
          longitude: centerCoords.longitude,
          zoom: 4,
        }}
        mapStyle={`mapbox://styles/mapbox/${lightMode ? 'light' : 'dark'}-v10`}
        mapboxAccessToken={MAPBOX_API}
      >
        <MapControl />

        {validContacts.map((contact, index) => (
          <MapMarker
            key={`marker-${contact.id || index}`}
            latitude={parseFloat(contact.latitude)}
            longitude={parseFloat(contact.longitude)}
            onClick={(event) => {
              event.originalEvent.stopPropagation();
              setPopupInfo(contact);
            }}
          />
        ))}

        {popupInfo && (
          <MapPopup
            longitude={parseFloat(popupInfo.longitude)}
            latitude={parseFloat(popupInfo.latitude)}
            onClose={() => setPopupInfo(null)}
            sx={{
              '& .mapboxgl-popup-content': { bgcolor: 'common.white' },
              '&.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip': {
                borderTopColor: '#FFF',
              },
              '&.mapboxgl-popup-anchor-top .mapboxgl-popup-tip': {
                borderBottomColor: '#FFF',
              },
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              {popupInfo.code || 'N/A'}
            </Typography>

            <Typography component="div" variant="caption" sx={{ mb: 1 }}>
              {popupInfo.address || 'No address'}
            </Typography>

            <Typography component="div" variant="caption" sx={{ mb: 0.5 }}>
              Value at Risk: ${parseFloat(popupInfo.value_at_risk || 0).toLocaleString()}
            </Typography>

            <Typography component="div" variant="caption" sx={{ mb: 0.5 }}>
              Construction: {popupInfo.construction_type || 'N/A'}
            </Typography>

            <Typography component="div" variant="caption" sx={{ mb: 0.5 }}>
              Occupancy: {popupInfo.occupancy === 'RES' ? 'Residential' : 'Commercial'}
            </Typography>

            <Typography component="div" variant="caption" color="error.main" sx={{ mt: 1 }}>
              <Iconify 
                icon={popupInfo.flood_risk_areas === 'CRITICAL' ? 'mdi:alert' : 'mdi:information'} 
                width={14} 
                sx={{ mr: 0.5, verticalAlign: 'text-bottom' }} 
              />
              Flood Risk: {popupInfo.flood_risk_areas || 'N/A'}
            </Typography>
          </MapPopup>
        )}
      </Map>
    </StyledRoot>
  );
}

ContactMap.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      code: PropTypes.string,
      address: PropTypes.string,
      latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value_at_risk: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      construction_type: PropTypes.string,
      occupancy: PropTypes.string,
      flood_risk_areas: PropTypes.string
    })
  )
};