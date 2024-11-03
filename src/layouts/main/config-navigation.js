import { paths } from 'src/routes/paths';

import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export const navConfig = [
  {
    title: 'Home',
    icon: <Iconify icon="solar:home-2-bold-duotone" />,
    path: '/',
  },
  
  {
    title: 'About us',
    icon: <Iconify icon="solar:atom-bold-duotone" />,
    path: paths.about,
  },
  {
    title: 'Pricing',
    icon: <Iconify icon="solar:atom-bold-duotone" />,
    path: paths.pricing,
  },
  
  {
    title: 'FAQs',
    icon: <Iconify icon="solar:atom-bold-duotone" />,
    path: paths.faqs,
  },
  {
    title: 'Contact us',
    icon: <Iconify icon="solar:atom-bold-duotone" />,
    path: paths.contact,
  },
  
];
