import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Image from 'src/components/image';
import { useSettingsContext } from 'src/components/settings';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function HomeColorPresets() {
  const settings = useSettingsContext();

  const renderDescription = (
    <Stack spacing={3} sx={{ textAlign: 'center' }}>
      <m.div variants={varFade().inDown}>
        <Typography component="div" variant="overline" sx={{ color: 'text.disabled' }}>
          customize your dashboard
        </Typography>
      </m.div>

      <m.div variants={varFade().inDown}>
        <Typography variant="h2"> Smart Visualization Options </Typography>
      </m.div>

      <m.div variants={varFade().inDown}>
        <Typography sx={{ color: 'text.secondary' }}>
        Adapt your project views with intelligent color coding and visual preferences.
        </Typography>
      </m.div>
    </Stack>
  );

  const renderContent = (
    <Box sx={{ position: 'relative' }}>
      <Image disabledEffect alt="grid" src="/assets/images/home/presets/grid.webp" />

      <Box sx={{ position: 'absolute', top: 0 }}>
        <m.div variants={varFade().inUp}>
          <Image
            disabledEffect
            alt="screen"
            // src={`/assets/images/home/presets/screen_${settings.themeColorPresets}.webp`}
            src="/assets/images/home/presets/screen_def.webp"
          />
        </m.div>
      </Box>

      <Box sx={{ position: 'absolute', top: 0 }}>
        <m.div variants={varFade().inDown}>
          <m.div animate={{ y: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity }}>
            <Image
              disabledEffect
              alt="sidebar"
              src={`/assets/images/home/presets/block_${settings.themeColorPresets}.webp`}
            />
          </m.div>
        </m.div>
      </Box>

      <Box sx={{ position: 'absolute', top: 0 }}>
        <m.div variants={varFade().inDown}>
          <m.div animate={{ y: [-5, 10, -5] }} transition={{ duration: 8, repeat: Infinity }}>
            <Image
              disabledEffect
              alt="chart"
              src={`/assets/images/home/presets/chart_${settings.themeColorPresets}.webp`}
            />
          </m.div>
        </m.div>
      </Box>

      <Box sx={{ position: 'absolute', top: 0 }}>
        <m.div variants={varFade().inDown}>
          <m.div animate={{ y: [-25, 5, -25] }} transition={{ duration: 10, repeat: Infinity }}>
            <Image
              disabledEffect
              alt="sidebar"
              src={`/assets/images/home/presets/sidebar_${settings.themeColorPresets}.webp`}
            />
          </m.div>
        </m.div>
      </Box>
    </Box>
  );

  return (
    <Container
      component={MotionViewport}
      sx={{
        position: 'relative',
        py: { xs: 10, md: 15 },
      }}
    >
      {renderDescription}
      {renderContent}
    </Container>
  );
}
