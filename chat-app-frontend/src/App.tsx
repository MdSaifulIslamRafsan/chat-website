// import { useState, useEffect } from "react";
// import { socket } from "./utils/socket";

import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import { useAppSelector } from "./redux/hooks";

// export default function App() {
//   const [isConnected, setIsConnected] = useState(socket.connected);

//   // const [fooEvents, setFooEvents] = useState([]);

//   useEffect(() => {
//     function onConnect() {
//       socket.emit("userId", "68e79eb73b03ba34cb09fe51");
//       setIsConnected(true);
//     }

//     function onDisconnect() {
//       socket.emit("userId", "68e79eb73b03ba34cb09fe51");
//       setIsConnected(false);
//     }

//     // function onFooEvent(value) {
//     //   setFooEvents((previous) => [...previous, value]);
//     // }

//     socket.on("connect", onConnect);
//     socket.on("disconnect", onDisconnect);
//     // socket.on("foo", onFooEvent);

//     return () => {
//       socket.off("connect", onConnect);
//       socket.off("disconnect", onDisconnect);
//       // socket.off("foo", onFooEvent);
//     };
//   }, []);
//   console.log(socket);

//   return <div className="App"> {isConnected ? "Connected" : "offline"}</div>;
// }

const App = () => {
  const { showSidebar } = useAppSelector((state) => state.layout);

  return (
    <div className="p-5">
      <div className="container flex border-2 border-border rounded-2xl  mx-auto">
        <div
          className={`w-full md:max-w-xs lg:max-w-sm transition-all duration-300 ${
            showSidebar ? "block" : "hidden md:block"
          }`}
        >
          <Sidebar></Sidebar>
        </div>
        <div
          className={`flex-1 transition-all duration-300 ${
            showSidebar ? "hidden md:flex" : "flex"
          }`}
        >
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default App;
