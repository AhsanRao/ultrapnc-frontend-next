// import * as Yup from 'yup';
// import { useCallback } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';

// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import Grid from '@mui/material/Unstable_Grid2';
// import Typography from '@mui/material/Typography';
// import LoadingButton from '@mui/lab/LoadingButton';

// import { useMockedUser } from 'src/hooks/use-mocked-user';

// import { fData } from 'src/utils/format-number';

// import { countries } from 'src/assets/data';

// import Iconify from 'src/components/iconify';
// import { useSnackbar } from 'src/components/snackbar';
// import FormProvider, {
//   RHFSwitch,
//   RHFTextField,
//   RHFUploadAvatar,
//   RHFAutocomplete,
// } from 'src/components/hook-form';
// import { useAuthContext } from 'src/auth/hooks';

// // ----------------------------------------------------------------------

// export default function AccountGeneral() {
//   const { enqueueSnackbar } = useSnackbar();

//   const { user } = useAuthContext();

//   const UpdateUserSchema = Yup.object().shape({
//     firstName: Yup.string().required('First name is required'),
//     lastName: Yup.string().required('Last name is required'),
//     username: Yup.string().required('Username is required'),
//     email: Yup.string().required('Email is required').email('Email must be a valid email address'),
//     photoURL: Yup.mixed().nullable().required('Avatar is required'),
//     phoneNumber: Yup.string().required('Phone number is required'),
//     company: Yup.string().required('Company is required'),
//     country: Yup.string().required('Country is required'),
//     address: Yup.string().required('Address is required'),
//     state: Yup.string().required('State is required'),
//     city: Yup.string().required('City is required'),
//     zipCode: Yup.string().required('Zip code is required'),
//     // not required
//     isPublic: Yup.boolean(),
//   });

//   const defaultValues = {
//     firstName: user?.first_name || '',
//     lastName: user?.last_name || '',
//     username: user?.username || '',
//     email: user?.email || '',
//     photoURL: user?.profile_image_url || null,
//     phoneNumber: user?.phone_number || '',
//     company: user?.company || '',
//     country: user?.country || '',
//     address: user?.address || '',
//     state: user?.state || '',
//     city: user?.city || '',
//     zipCode: user?.zip_code || '',
//     isPublic: user?.isPublic || false,
//   };

//   const methods = useForm({
//     resolver: yupResolver(UpdateUserSchema),
//     defaultValues,
//   });

//   const {
//     setValue,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = methods;

//   const onSubmit = handleSubmit(async (data) => {
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 500));
//       enqueueSnackbar('Update success!');
//       console.info('DATA', data);
//     } catch (error) {
//       console.error(error);
//     }
//   });

//   const handleDrop = useCallback(
//     (acceptedFiles) => {
//       const file = acceptedFiles[0];

//       const newFile = Object.assign(file, {
//         preview: URL.createObjectURL(file),
//       });

//       if (file) {
//         setValue('photoURL', newFile, { shouldValidate: true });
//       }
//     },
//     [setValue]
//   );

//   return (
//     <FormProvider methods={methods} onSubmit={onSubmit}>
//       <Grid container spacing={3}>
//         <Grid xs={12} md={4}>
//           <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
//             <RHFUploadAvatar
//               name="photoURL"
//               maxSize={3145728}
//               onDrop={handleDrop}
//               helperText={
//                 <Typography
//                   variant="caption"
//                   sx={{
//                     mt: 3,
//                     mx: 'auto',
//                     display: 'block',
//                     textAlign: 'center',
//                     color: 'text.disabled',
//                   }}
//                 >
//                   Allowed *.jpeg, *.jpg, *.png, *.gif
//                   <br /> max size of {fData(3145728)}
//                 </Typography>
//               }
//             />

//             <Button variant="soft" color="error" sx={{ mt: 3 }}>
//               Delete Account
//             </Button>
//           </Card>
//         </Grid>

//         <Grid xs={12} md={8}>
//           <Card sx={{ p: 3 }}>
//             <Box
//               rowGap={3}
//               columnGap={2}
//               display="grid"
//               gridTemplateColumns={{
//                 xs: 'repeat(1, 1fr)',
//                 sm: 'repeat(2, 1fr)',
//               }}
//             >
              
//               <RHFTextField name="username" label="Username" disabled/>
//               <RHFTextField name="email" label="Email Address" disabled />
//               <RHFTextField name="firstName" label="First Name" />
//               <RHFTextField name="lastName" label="Last Name" />
//               <RHFTextField name="phoneNumber" label="Phone Number" />
//               <RHFTextField name="company" label="Company" />
//               <RHFTextField name="address" label="Address" />

//               <RHFAutocomplete
//                 name="country"
//                 label="Country"
//                 options={countries.map((country) => country.label)}
//                 getOptionLabel={(option) => option}
//                 renderOption={(props, option) => {
//                   const { code, label, phone } = countries.filter(
//                     (country) => country.label === option
//                   )[0];

//                   if (!label) {
//                     return null;
//                   }

//                   return (
//                     <li {...props} key={label}>
//                       <Iconify
//                         key={label}
//                         icon={`circle-flags:${code.toLowerCase()}`}
//                         width={28}
//                         sx={{ mr: 1 }}
//                       />
//                       {label} ({code}) +{phone}
//                     </li>
//                   );
//                 }}
//               />

//               <RHFTextField name="state" label="State/Region" />
//               <RHFTextField name="city" label="City" />
//               <RHFTextField name="zipCode" label="Zip/Code" />
//             </Box>

//             <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
//               <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
//                 Save Changes
//               </LoadingButton>
//             </Stack>
//           </Card>
//         </Grid>
//       </Grid>
//     </FormProvider>
//   );
// }
import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { fData } from 'src/utils/format-number';
import axios, { endpoints } from 'src/utils/axios';

import { countries } from 'src/assets/data';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';


export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const { user, updateProfile } = useAuthContext();

  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    photoURL: Yup.mixed().nullable().required('Avatar is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    company: Yup.string().required('Company is required'),
    country: Yup.string().required('Country is required'),
    address: Yup.string().required('Address is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    zipCode: Yup.string().required('Zip code is required'),
    isPublic: Yup.boolean(),
  });

  const defaultValues = {
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    username: user?.username || '',
    email: user?.email || '',
    photoURL: user?.profile_image_url || null,
    phoneNumber: user?.phone_number || '',
    company: user?.company || '',
    country: user?.country || '',
    address: user?.address || '',
    state: user?.state || '',
    city: user?.city || '',
    zipCode: user?.zip_code || '',
    isPublic: user?.isPublic || false,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleDrop = useCallback(
      async (acceptedFiles) => {
        try {
          const file = acceptedFiles[0];
          if (file) {
            // Create preview
            setValue('photoURL', Object.assign(file, {
              preview: URL.createObjectURL(file),
            }));
  
            // Upload immediately when file is dropped
            const formData = new FormData();
            formData.append('profile_image', file);
  
            await axios.post(endpoints.auth.updateProfileImage, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
  
            enqueueSnackbar('Avatar updated successfully!');
          }
        } catch (error) {
          console.error('Error uploading avatar:', error);
          enqueueSnackbar(error.message || 'Error uploading avatar', { variant: 'error' });
        }
      },
      [setValue, enqueueSnackbar]
    );
  
    const onSubmit = handleSubmit(async (data) => {
      try {
        // Update only profile information
        const profileData = {
          id: user.id,
          email: data.email,
          username: data.username,
          first_name: data.firstName,
          last_name: data.lastName,
          phone_number: data.phoneNumber,
          company: data.company,
          country: data.country,
          address: data.address,
          state: data.state,
          city: data.city,
          zip_code: data.zipCode,
        };
  
        await updateProfile(profileData);
        enqueueSnackbar('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        enqueueSnackbar(error.message || 'Error updating profile', { variant: 'error' });
      }
    });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />

            <Button variant="soft" color="error" sx={{ mt: 3 }}>
              Delete Account
            </Button>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="username" label="Username" disabled/>
              <RHFTextField name="email" label="Email Address" disabled />
              <RHFTextField name="firstName" label="First Name" />
              <RHFTextField name="lastName" label="Last Name" />
              <RHFTextField name="phoneNumber" label="Phone Number" />
              <RHFTextField name="company" label="Company" />
              <RHFTextField name="address" label="Address" />

              <RHFAutocomplete
                name="country"
                label="Country"
                options={countries.map((country) => country.label)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => {
                  const { code, label, phone } = countries.filter(
                    (country) => country.label === option
                  )[0];

                  if (!label) {
                    return null;
                  }

                  return (
                    <li {...props} key={label}>
                      <Iconify
                        key={label}
                        icon={`circle-flags:${code.toLowerCase()}`}
                        width={28}
                        sx={{ mr: 1 }}
                      />
                      {label} ({code}) +{phone}
                    </li>
                  );
                }}
              />

              <RHFTextField name="state" label="State/Region" />
              <RHFTextField name="city" label="City" />
              <RHFTextField name="zipCode" label="Zip/Code" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}