import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { icons } from "../constants";

const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 64px;
  background: transparent;
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 0.5px solid #232533;
  padding-top: 8px;
`;

const TabIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const TabText = styled.span<{ $active: boolean }>`
  font-size: 12px;
  color: ${({ $active }) => ($active ? "#FF7F00" : "#CDCDE0")};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
`;

const TabItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const NavigationTabs = () => {
  return (
    <Nav>
      <NavLink to="/home">
        {({ isActive }) => (
          <TabItem>
            <TabIcon src={icons.home} />
            <TabText $active={isActive}>Wizyty</TabText>
          </TabItem>
        )}
      </NavLink>
      <NavLink to="/create">
        {({ isActive }) => (
          <TabItem>
            <TabIcon src={icons.plus} />
            <TabText $active={isActive}>Dodaj</TabText>
          </TabItem>
        )}
      </NavLink>
      {
        <NavLink to="/profile">
          {({ isActive }) => (
            <TabItem>
              <TabIcon src={icons.profile} />
              <TabText $active={isActive}>Profil</TabText>
            </TabItem>
          )}
        </NavLink>
      }
    </Nav>
  );
};

export default NavigationTabs;
