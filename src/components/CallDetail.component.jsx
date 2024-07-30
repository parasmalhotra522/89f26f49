  import React, { useEffect, useState } from 'react';
  import { Box, Text, Image, IconButton, Flex, Stack, Button, useToast, Divider, Spinner } from '@chakra-ui/react';
  import { MdArrowBack, MdCall , MdMessage, MdVideocam, MdEmail} from "react-icons/md";
  import { useNavigate, useParams } from 'react-router-dom';
  import profileImage from '../assets/images/userImage.webp';
  import axios from 'axios';
  import { format } from 'date-fns';

  const CallDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [callDetails, setCallDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [archivedStatus, setArchivedStatus] = useState();
    
    const baseUrl = process.env.REACT_APP_BASE_URL || "https://aircall-backend.onrender.com"
    const apiUrl = baseUrl + `/activities/${id}`;

    const handleBackClick = () => {
      // navigating it to the previous route
      navigate(-1);
    };

    // ---- GET: Api to get /:id
    // Showcasing toast as the messages on error and successful api calls
    const fetchCallDetails = async () => {
      try {
        const { data } = await axios.get(apiUrl);
        setCallDetails(data);
        setLoading(false);
        toast({
          title: 'Call Details retrieved successfully',
          position: 'top-right',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.log("Getting error in fetch Call..")
        setLoading(false);
        toast({
          title: 'Error retrieving Call Details',
          position: 'top-right',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    // Api call to perform the fetchinf of the specific Call Record detail based on user click
    useEffect(() => {
      fetchCallDetails();
    }, []);

    // Format duration from seconds to "X min Y sec"
    const formatDuration = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes} min ${remainingSeconds} sec`;
    };

    // -- Formatting call based on the call direction either inbound/outbound
    const formatCallType = () => {
      if (!callDetails) return '';
      const directionText = callDetails.direction === 'inbound' ? 'Incoming' : 'Outgoing';
      return `${directionText} ${callDetails.call_type.charAt(0).toUpperCase() + callDetails.call_type.slice(1)} Call`;
    };


    // perform Api call to change the status of the archive
    const handleArchive = async () => {
      try {

        setLoading(true);
      console.log("Checking the archive", callDetails.id, "Current Status", callDetails.is_archived);
      //BASE_URL/activities/<call_id>
        const archiveMode = !callDetails.is_archived; // inverting the existing achrive mode button
        setArchivedStatus(archiveMode); // setting the state of the current archive status
        const res = await axios.patch(`${baseUrl}/activities/${callDetails.id}`, {
        is_archived:archiveMode
      })
      // console.log("Checking the reuslt", res); // 
      toast({
          title: res.data,
          position:'top-right',
          status: 'success',
          duration: 3000,
          isClosable: true,
      })
        setLoading(false);
    
      } catch (error) {
        console.log("Checking the erro", error)
        setLoading(false);
        toast({
          title: 'Error Updating the status',
          position:'top-right',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          })
      }
    
    
    }

    const upcomingFeatures = () => {
      toast({
          title: 'Future Updates',
          position:'top-right',
          description: "These features will be added in the future updates",
          status: 'warning',
          duration: 3000,
          isClosable: true,
          })
    }

    return (
      <Box
        bgGradient="linear(to-b, gray.200, gray.100)"
        borderRadius="md"
        p={4}
        maxW="400px"
        mx="auto"
        boxShadow="md"
      >
        {/* Header with Back Button */}
        <Flex alignItems="center" mb={4}>
          <IconButton
            icon={<MdArrowBack />}
            aria-label="Back"
            variant="ghost"
            colorScheme="gray"
            mr={2}
            onClick={handleBackClick}
          />
          <Text fontSize="lg" fontWeight="bold">Call Detail</Text>
        </Flex>
        {loading ? (
          <Flex justifyContent="center" alignItems="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        ) :
          (callDetails && (
            <>
              {/* Profile Section */}
              <Box textAlign="center">
                <Image
                  borderRadius="full"
                  boxSize="80px"
                  src={profileImage}
                  alt="Profile"
                  mx="auto"
                />
                <Text fontSize="2xl" fontWeight="bold" mt={2}>{callDetails.from}</Text>
                <Text color="gray.500">Aircall Number: {callDetails.via}</Text>
                <Text color="gray.500">{callDetails.direction === 'inbound' ? 'From' : 'To'}: {callDetails.to}</Text>
              </Box>
                  

              {/* Displaying the buttons for actions like calling/texting */}
              <Flex justify="space-between" mt={4} mb={4}>
            
                <IconButton
                  icon={<MdMessage />}
                  aria-label="Message"
                  variant='outline'
                  borderRadius="full"
                  p={2}
                  onClick={upcomingFeatures}
                />
                <IconButton
                  icon={<MdCall />}
                  aria-label="Call"
                  variant="outline"
                  borderRadius="full"
                  p={2}
                  onClick={upcomingFeatures}
                />
                <IconButton
                  icon={<MdVideocam />}
                  aria-label="Video Call"
                  variant="outline"
                  borderRadius="full"
                  p={2}
                  onClick={upcomingFeatures}
                />
                <IconButton
                  icon={<MdEmail />}
                  aria-label="Email"
                  variant="outline"
                  borderRadius="full"
                  p={2}
                  onClick={upcomingFeatures}
                />
              </Flex>

              {/* ----- Call Details ----  */}
              <Box bg="white" borderRadius="md" p={4} mb={4}>
                <Text fontSize="lg" fontWeight="bold">{format(new Date(callDetails.created_at), 'MMM d, yyyy')}</Text>
                <Text color="gray.500" mb={2}>
                  {format(new Date(callDetails.created_at), 'h:mm a')} {formatCallType()}
                </Text>
                <Text color="gray.500">{formatDuration(callDetails.duration)}</Text>
                {archivedStatus && <Text color="red.500" fontWeight="bold">Archived</Text>}
              </Box>

              {/* Additional Options */}
              <Stack spacing={2}>

                <Button variant="link" colorScheme="red" onClick={handleArchive}>
                  {
                    archivedStatus ? 'Remove from Archeive' : 'Archive the Caller'
                  }
                </Button>

                <Divider borderColor="gray.200" />
                <Button variant="link" colorScheme="blue" onClick={upcomingFeatures}>Share Contact</Button>
                  
                 {/* can be implemented to showcase better functionality */}
                <Button variant="link" colorScheme="blue" onClick={upcomingFeatures}>Create New Contact</Button>
                <Button variant="link" colorScheme="blue" onClick={upcomingFeatures}>Add to Existing Contact</Button>
                <Button variant="link" colorScheme="blue" onClick={upcomingFeatures}>Add to Emergency Contacts</Button>
              
              </Stack>
            </>
          ))

        }
        
      </Box>
    );
  };

  export default CallDetail;
