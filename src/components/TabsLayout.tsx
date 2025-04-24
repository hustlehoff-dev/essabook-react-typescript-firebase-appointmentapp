import { Outlet } from "react-router-dom";
import NavigationTabs from "../components/NavigationTabs";

const TabsLayout = () => {
  return (
    <div style={{ paddingBottom: "80px" }}>
      <Outlet />
      <NavigationTabs />
    </div>
  );
};

export default TabsLayout;
