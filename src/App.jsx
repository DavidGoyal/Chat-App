import {Box,Container,VStack,Button, HStack, Input} from "@chakra-ui/react"
import Message from "./Components/Message"
import {onAuthStateChanged,getAuth,GoogleAuthProvider,signInWithPopup,signOut} from "firebase/auth"
import app from "./firebase"
import { useEffect, useState} from "react";
import {addDoc, collection,getFirestore, serverTimestamp,onSnapshot,query,orderBy, deleteDoc, doc} from "firebase/firestore"
import { useRef } from "react";

const auth=getAuth(app);
const firestore=getFirestore(app);

const loginHandler=()=>{
  const provider=new GoogleAuthProvider();
  signInWithPopup(auth,provider);
}

const logoutHandler=()=>signOut(auth);

function App() {

  const q=query(collection(firestore,"Messages"),orderBy("createdAt","asc"));
  const [user,setUser]=useState(false);
  const [message,setMessage]=useState("");
  const [messages,setMessages]=useState([]);
  const divForScroll=useRef();

  useEffect(() => {
    const unsubscribe=onAuthStateChanged(auth,(data)=>{
      setUser(data);
    })

    const unsubscribeForMesssage=onSnapshot(q,(snap)=>{
      setMessages(
        snap.docs.map((item)=>{
          const id=item.id;
          return {id,...item.data()};
        })
      )
    })

    return ()=>{
      unsubscribe();
      unsubscribeForMesssage();
    }
  },[])

  const submitHandler=async(e)=>{
    e.preventDefault();
    
    try {
      await addDoc(collection(firestore,"Messages"),{
        text:message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      alert(error);
    }
    divForScroll.current.scrollIntoView({behavior:"smooth"});
    setMessage("");
  
  }


  const deleteHandler=(id)=>{
    const deleteItem=doc(firestore,"Messages",id);
    deleteDoc(deleteItem);
  }
  
  return (
    <Box h="100vh" bg={"red.50"}>                                          {/*div*/}
      {
      user?(
      <Container h={"100vh"} bg={"white"} paddingY={4}>          {/*div with some max width*/}
        <VStack h="full">                                        {/*div with flex direction column*/}
          
          <Button onClick={logoutHandler} colorScheme={"red"} w={"full"}>
            Logout
          </Button>




        <VStack h={"full"} w={"full"} overflowY={"auto"}>   
        {
          messages.map((item,index)=>(
            <Message  key={index} user={item.uid===user.uid?"me":"other"} uri={item.uri} text={item.text} deleteHandler={deleteHandler} id={item.id}/>
          ))
        }

        <div ref={divForScroll}></div>
        </VStack>






        <form style={{width:"100%"}}>
          <HStack>                                                      {/*div with flex direction row*/}

            <Input  value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Enter something...">
            </Input>
            <Button onClick={submitHandler} colorScheme="purple" type="submit">
              Send
            </Button>

          </HStack>
        </form>


        </VStack>
      </Container>):
      <VStack h="full">
        <Button  justifySelf={"center"} alignSelf={"center"} onClick={loginHandler} colorScheme="purple">Sign in with Google</Button>
      </VStack>
}
    </Box>
  )
}

export default App
