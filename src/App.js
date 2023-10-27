import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import './App.css';
import { Alert, Button, Icon, Typography } from "@mui/material";
import Container from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.primary,
}));

function App() {
  let [accidents, setAccidents] = useState([]);
  let socketio = useRef(null);

  useEffect(() => {
    console.log("Inside effect");
    socketio.current = io("https://vigyan-backend.onrender.com");

    // register events
    socketio.current.onAny((eventName, data) => {
      console.log("Caught " + eventName);
      console.log(data);
    })

    socketio.current.on("connect", ()=>{
      console.log("Connected to SocketIO Server");
    })
    
    socketio.current.on("accident", (data) => {
      setAccidents(x => [[data.latitude, data.longitude], ...x])
    })

    return ()=>{
      socketio.current.disconnect();
      socketio.current.removeAllListeners();
      console.log("Clean up");
    }
  }, []);

  return (
    <>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
      <Container>
        <center>
          <Stack sx={{ width: '50%', margin: '25px' }} spacing={2}>
            {
              accidents.map(pospair =>
              <Alert severity="warning" action={
                <Button color="inherit">
                  <a href={"http://maps.google.com/maps?z=12&t=m&q=" + pospair[1] + "," + pospair[0]} target="_blank">
                    <Icon>open_in_new</Icon>
                  </a>
                </Button>
              }>
                <Typography>
                {/* <Icon style={{"margin-left":"10px", "margin-right":"10px"}}>car_crash</Icon> */}
                  Accident detected at {pospair[0]}, {pospair[1]}
                </Typography>
              </Alert>
              )
            }
          </Stack>
        </center>
      </Container>
    </>
  );
}

export default App;
