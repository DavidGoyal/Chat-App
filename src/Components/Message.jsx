import React from 'react'
import { HStack,Avatar,Text, Button } from '@chakra-ui/react'
import {RiDeleteBinLine} from "react-icons/ri";

const Message = ({text,uri,user="other",deleteHandler,id}) => {
  return (
    <HStack  alignSelf={user==="me"?"flex-end":"flex-start"} borderRadius={"base"} bg="gray.100" paddingX={4} paddingY={2} pos={"relative"}>
        {
            user==="other"&&<Avatar src={uri}/>
        }

        <Text>{text}</Text>

        {
            user==="me"&&<Avatar src={uri}/>
        }
        {
          user==="me"&&<RiDeleteBinLine onClick={()=>deleteHandler(id)} style={{position:"absolute",top:"1px",right:"1px",fontSize:"10px"}}/>
        }
        {
          user==="other"&&<RiDeleteBinLine onClick={()=>deleteHandler(id)} style={{position:"absolute",top:"1px",left:"1px",fontSize:"10px"}}/>
        }

    </HStack>
  )
}

export default Message