import React from 'react'
import { Container, Divider, Box } from '@chakra-ui/react';
import Header from './Header';
import { Outlet, useLocation } from 'react-router-dom';
import ActivityFeed from './ActivityFeed.component';

const Home = () => {
  const location = useLocation();

  return (
    <Container display='flex' flexDirection='column' alignItems='center' maxW='container.lg'
      overflowX='hidden'
      py={3}>
      <Header/>

      <Divider my={3} borderColor='gray.200' />
      {/* Setting the Box with width so it adjusts automatically to the smaller devices */}
      <Box 
        maxH='auto'
        p='1.2rem'
        m='0'
        justifyContent='center'
        width={['100vw', '100vw', '80vw', '80vw']}
        overflowX='hidden'
        // mx='auto'
        >
        {location.pathname==='/' && <ActivityFeed/>}  
        <Outlet>

        </Outlet>
      </Box>
    </Container>
  )
}

export default Home





