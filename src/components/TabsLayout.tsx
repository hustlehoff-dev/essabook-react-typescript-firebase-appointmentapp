import { Outlet } from "react-router-dom";
import NavigationTabs from "../components/NavigationTabs";
import styled from "styled-components";

const TabsLayout = () => {
  return (
    <PagesLayout>
      <Outlet />
      <NavigationTabs />
    </PagesLayout>
  );
};

export default TabsLayout;

const PagesLayout = styled.div`
  /*background-image: radial-gradient(transparent 0%, rgba(255, 127, 0, 0.05)),
    linear-gradient(
      283deg,
      rgba(228, 228, 228, 0.04) 0%,
      rgba(228, 228, 228, 0.04) 30%,
      rgba(130, 130, 130, 0.04) 30%,
      rgba(130, 130, 130, 0.04) 49%,
      rgba(31, 31, 31, 0.04) 49%,
      rgba(31, 31, 31, 0.04) 100%
    ),
    linear-gradient(
      297deg,
      rgba(228, 228, 228, 0.04) 0%,
      rgba(228, 228, 228, 0.04) 20%,
      rgba(130, 130, 130, 0.04) 20%,
      rgba(130, 130, 130, 0.04) 60%,
      rgba(31, 31, 31, 0.04) 60%,
      rgba(31, 31, 31, 0.04) 100%
    ),
    linear-gradient(
      242deg,
      rgba(228, 228, 228, 0.04) 0%,
      rgba(228, 228, 228, 0.04) 29%,
      rgba(130, 130, 130, 0.04) 29%,
      rgba(130, 130, 130, 0.04) 48%,
      rgba(31, 31, 31, 0.04) 48%,
      rgba(31, 31, 31, 0.04) 100%
    ),
    linear-gradient(90deg, rgb(0, 0, 0), rgb(0, 0, 0));
  background-attachment: fixed;*/
  background-color: #121212;
  padding-bottom: 64px;
  min-height: 100vh;
`;
