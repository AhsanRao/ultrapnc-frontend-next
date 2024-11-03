import PropTypes from 'prop-types';

import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';
import { useAuthContext } from 'src/auth/hooks';
import AccountPopover from '../common/account-popover';

import { PATH_AFTER_LOGIN } from 'src/config-global';

// ----------------------------------------------------------------------

export default function LoginButton({ sx }) {
  const { authenticated } = useAuthContext();

  return authenticated ? (
    <AccountPopover />
  ) : (
    <Button
      component={RouterLink}
      href={PATH_AFTER_LOGIN}
      variant="contained"
      sx={{ mr: 1, ...sx }}
    >
      Login
    </Button>
  );
}

LoginButton.propTypes = {
  sx: PropTypes.object,
};
