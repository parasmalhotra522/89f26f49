import React, { Suspense, lazy, useEffect, useState } from 'react';
import axios from 'axios';
import { useToast, Spinner, Box, Text, Tab, TabList, Tabs, TabPanel, TabPanels, Flex } from '@chakra-ui/react';
import { format } from 'date-fns';

const CallCard = lazy(() => import('./CallCard.component.jsx'));

const ActivityFeed = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL || "https://aircall-backend.onrender.com";
  const [activities, setActivities] = useState([]);
  const [archivedCalls, setArchivedCalls] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [tabIndex, setTabIndex] = useState(0);

  // -- Api call to get the list of all the activities
  const getActivityFeed = async () => {
    try {
      const { data } = await axios.get(BASE_URL + '/activities');
      // Filtering and setting state based on the archived / non-archived status
      setActivities(data.filter(d => !d.is_archived));
      setArchivedCalls(data.filter(d => d.is_archived));
      setLoading(false);
      toast({
        title: 'Activity Feed retrieved Successfully',
        position: 'top-right',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      setLoading(false);
      setError(error);
      toast({
        title: 'Error retrieving Activity Feed',
        position: 'top-right',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // --- Making Groups of the calls based on the dates to be shown on the screen
  const groupByDate = (activities) => {
    return activities.reduce((groups, activity) => {
      const date = format(new Date(activity.created_at), 'MMM d, yyyy');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
      return groups;
    }, {});
  };

  // --- We had the objects in the ascending order, just changing the order to showcase latest call logs first..
  const sortObjectKeys = (obj) => {
    const sortedKeys = Object.keys(obj).sort((a, b) => new Date(b) - new Date(a));
    const sortedObject = {};
    sortedKeys.forEach(key => {
      sortedObject[key] = obj[key];
    });
    return sortedObject;
  };

  const groupedActivities = sortObjectKeys(groupByDate(activities));
  const groupedArchivedCalls = sortObjectKeys(groupByDate(archivedCalls));

  useEffect(() => {
    getActivityFeed();
  }, []);

  return (
    <Box
      bgGradient="linear(to-b, blue.500, blue.300)"
      borderRadius="30px"
      h={{base:'auto', md:'41rem'}}
      p={4}
      w={{ base: '100%', md: '40rem' }} 
      // maxH="40rem"
      mx="auto"
      boxShadow="lg"
      overflowY='auto'
    >
      {/* Making Tabs for Recent Calls and Archive Calls */}
      <Tabs isFitted
        variant="unstyled"
        index={tabIndex}
        onChange={(index) => setTabIndex(index)}>
        <TabList
          position='sticky'
          
          mb='1em'
         
        >
          <Tab _selected={{ color: 'white', fontWeight: 'bold', fontSize:'1.1rem', borderBottom: '2px solid white' }}>RECENT</Tab>
          <Tab _selected={{ color: 'white', fontWeight: 'bold', fontSize:'1.1rem', borderBottom: '2px solid white' }}>ARCHIVED</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {/* if there are no calls, then showcase no calls data otherwise group it and show all the call logs
           which are not archived yet */}
            {activities.length === 0 && !loading && (
              <Flex justify="center" align="center" height="100%">
                <Text fontSize='md'>No Call Data</Text>
              </Flex>
            )}
            <Suspense
              fallback={
                <Flex justify="center" align="center" height="100%">
                  <Spinner size="xl" color="white" />
                </Flex>
              }
            >
              {loading ? (
                <Flex justify="center" align="center" height="100%">
                  <Spinner size="xl" color="white" />
                </Flex>
              ) : (
                Object.entries(groupedActivities).map(([date, activities]) => (
                  <Box key={date} mb={4}>
                    <Text fontSize="lg" fontWeight="bold" mb={2}>{date}</Text>
                    {activities.map(activity => (
                      <CallCard
                        key={activity.id}
                        activity={activity}
                        fromCall={activity.from}
                      />
                    ))}
                  </Box>
                ))
              )}
            </Suspense>
          </TabPanel>

          <TabPanel>
             {/* if there are no calls, then showcase no calls data otherwise group it and show all the call logs
           which are archived  */}
            {archivedCalls.length === 0 && !loading && (
              <Flex justify="center" align="center" height="100%">
                <Text fontSize='md'>No Archived Calls</Text>
              </Flex>
            )}
            <Suspense
              fallback={
                <Flex justify="center" align="center" height="100%">
                  <Spinner size="xl" color="white" />
                </Flex>
              }
            >
              {loading ? (
                <Flex justify="center" align="center" height="100%">
                  <Spinner size="xl" color="white" />
                </Flex>
              ) : (
                Object.entries(groupedArchivedCalls).map(([date, activities]) => (
                  <Box key={date} mb={4}>
                    <Text fontSize="lg" fontWeight="bold" mb={2}>{date}</Text>
                    {activities.map(activity => (
                      <CallCard
                        key={activity.id}
                        activity={activity}
                        fromCall={activity.from}
                      />
                    ))}
                  </Box>
                ))
              )}
            </Suspense>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default ActivityFeed;
