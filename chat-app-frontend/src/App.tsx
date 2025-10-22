import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import { useAppSelector } from "./redux/hooks";

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
