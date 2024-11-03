'use client';

import { useScroll } from 'framer-motion';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';

import MainLayout from 'src/layouts/main';

import ScrollProgress from 'src/components/scroll-progress';

import HomeHero from '../home-hero';
import HomeMinimal from '../home-minimal';
import HomePricing from '../home-pricing';
// import HomeDarkMode from '../home-dark-mode';
// import HomeLookingFor from '../home-looking-for';
// import HomeForDesigner from '../home-for-designer';
import HomeColorPresets from '../home-color-presets';
// import HomeAdvertisement from '../home-advertisement';
// import HomeCleanInterfaces from '../home-clean-interfaces';
// import HomeHugePackElements from '../home-hugepack-elements';

import FaqsList from '../../faqs/faqs-list';
import FaqsForm from '../../faqs/faqs-form';
import AboutVision from '../../about/about-vision';
// import AboutTeam from '../../about/about-team';
import AboutTestimonials from '../../about/about-testimonials';


// ----------------------------------------------------------------------

const StyledPolygon = styled('div')(({ anchor = 'top', theme }) => ({
  left: 0,
  zIndex: 9,
  height: 80,
  width: '100%',
  position: 'absolute',
  clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
  backgroundColor: theme.palette.background.default,
  display: 'block',
  lineHeight: 0,
  ...(anchor === 'top' && {
    top: -1,
    transform: 'scale(-1, -1)',
  }),
  ...(anchor === 'bottom' && {
    bottom: -1,
    backgroundColor: theme.palette.grey[900],
  }),
}));

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();

  return (
    <MainLayout>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <HomeHero />

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <HomeMinimal />

        {/* <HomeHugePackElements /> */}

        {/* <Box sx={{ position: 'relative' }}>
          <StyledPolygon />
          <HomeForDesigner />
          <StyledPolygon anchor="bottom" />
        </Box>

        <HomeDarkMode /> */}

        <HomeColorPresets />

        {/* <HomeCleanInterfaces /> */}

        <HomePricing />

        {/* <HomeLookingFor /> */}

        {/* <HomeAdvertisement /> */}
      </Box>
      <AboutVision />

      <AboutTestimonials />
      <Container
        sx={{
          pb: 10,
          pt: { xs: 10, md: 15 },
          position: 'relative',
        }}
      >
        <Box
          gap={10}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
        >
          <FaqsList />

          <FaqsForm />
        </Box>
      </Container>
      
      {/* <AboutTeam /> */}

    </MainLayout>
  );
}
