import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CustomButton from "../components/CustomButton";
import { images } from "../constants";

const Index = () => {
  const navigate = useNavigate(); // Używamy useNavigate do nawigacji

  return (
    <Wrapper>
      <ContentContainer>
        <div style={{ textAlign: "center" }}>
          <LogoImage src={images.logoSmall} alt="Small Logo" />
          <LargeLogoImage src={images.logo} alt="Large Logo" />

          <Title>
            Umawiaj wizyty z <Highlight>EssaBook</Highlight>
          </Title>

          <CustomButton
            title="Wbijaj"
            handlePress={() => {
              navigate("/auth");
            }}
          />
        </div>
      </ContentContainer>
    </Wrapper>
  );
};

// Styled Components dla stylów
const Wrapper = styled.section`
  background-color: var(--primary-color);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
  padding: 0 16px;
`;

const LogoImage = styled.img`
  max-width: 150px;
  width: 100%;
  height: 150px;
  margin-top: 20px;
`;

const LargeLogoImage = styled.img`
  max-width: 300px;
  width: 100%;
  height: 300px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: white;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
`;

const Highlight = styled.span`
  color: var(--secondary-color);
`;

export default Index;
