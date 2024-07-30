import React from 'react'
import { Box, Text, Flex, IconButton } from '@chakra-ui/react';
import { FcMissedCall } from "react-icons/fc";
import { VscCallOutgoing, VscCallIncoming } from "react-icons/vsc";
import { useNavigate } from 'react-router-dom';

const CallCard = ({activity, fromCall}) => {
  
    const {id, direction, call_type, duration, to } = activity;
   
    const navigate = useNavigate();

    // converting time in seconds to String of minutes + seconds
    const convertToMinutes = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes} min ${seconds} sec`;
    }


    // -- onClick->Call ----> call/:id details
    const handleClickCall = (callId) => {
        // console.log("Checking the callId Clicked..", callId);
        navigate(`/callDetails/${callId}`)
    }

    //  changing the icons for call received answered and if its missed call....
    let icon, cellNumber;
    // console.log("Checking data on call card side", activity);
    if (call_type === 'missed') {
        icon = <FcMissedCall />
        cellNumber = fromCall; 
    } else if (call_type === 'answered' && direction === 'inbound') {
        icon = <VscCallIncoming />
        cellNumber = fromCall;  
    } else if (call_type === 'answered' && direction === 'outbound'){
        icon = <VscCallOutgoing />
        cellNumber = to;
    }

    return (
    <>
       <Flex
        bg="gray.100"
        borderRadius="md"
        p={4}
        my={2}
        justifyContent="space-between"
        alignItems="center"
            boxShadow="sm"
                onClick={() => handleClickCall(id)}
                cursor='pointer'
    >
            <Box>
                <Text fontWeight="bold">{cellNumber}</Text>
                <Text fontSize='sm'>{duration !==0 ? convertToMinutes(duration) : '0 min'}</Text>
            </Box>
            <IconButton
            aria-label="Call type"
            icon={icon}
            bg="transparent"
            _hover={{ bg: 'transparent' }}
            />
            </Flex>
            </>

  )
}

export default CallCard;

