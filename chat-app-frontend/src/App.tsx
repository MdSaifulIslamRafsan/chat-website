import { useState, useEffect } from "react";
import { socket } from "./utils/socket";

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  // const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    // function onFooEvent(value) {
    //   setFooEvents((previous) => [...previous, value]);
    // }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    // socket.on("foo", onFooEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      // socket.off("foo", onFooEvent);
    };
  }, []);
  console.log(socket);

  return <div className="App"> {isConnected ? "Connected" : "offline"}</div>;
}
