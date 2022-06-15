import React from 'react';
import { Grid, Container } from '@mui/material';
import Box from '@mui/material/Box';
import HomeCard from './HomeCard';

const Home = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Container>
        <Grid container>
          <Grid item xs={12} md={6}>
            <HomeCard label="PLACE ORDER" image="parts.jpg" alt="parts" />
          </Grid>
          <Grid item xs={12} md={6}>
            <HomeCard
              label="PACKING"
              image="packing.jpg"
              alt="packing and shipping"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <HomeCard label="RECEIVING" image="receiving.jpg" alt="receiving" />
          </Grid>
          <Grid item xs={12} md={6}>
            <HomeCard label="ADMIN" image="admin.jpeg" alt="admin" />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
