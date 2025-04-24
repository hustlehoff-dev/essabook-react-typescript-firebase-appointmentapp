import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { images } from "../constants";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import styled from "styled-components";

// Styled components
const Container = styled.div`
  background-color: #121212;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ScrollContainer = styled.div`
  width: 100%;
  justify-content: center;
  min-height: 85vh;
  padding: 16px;
  margin: 24px 0;
  overflow-y: auto;
`;

const LogoSmall = styled.img`
  width: 85px;
  height: 85px;
`;

const Logo = styled.img`
  width: 115px;
  height: 115px;
`;

const Title = styled.h2`
  font-size: 24px;
  color: white;
  font-weight: 600;
  margin-top: 24px;
`;

const TextLink = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #ff8c00;
  cursor: pointer;
`;

const FormContainer = styled.div`
  width: 100%;
  justify-content: center;
  min-height: 85vh;
  padding: 16px;
  margin-top: 28px;
`;

const AuthScreen: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false); // Używamy stanu do przełączania widoków
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) navigate("/home"); // Przenosimy do strony home po udanym rejestracji
    } catch (error: any) {
      console.log(error);
      alert("Podaj dane logowania");
    }
  };

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate("/home");
    } catch (error: any) {
      console.log(error);
      alert("Podaj dane logowania");
    }
  };

  return (
    <Container>
      <ScrollContainer>
        <FormContainer>
          <LogoSmall src={images.logoSmall} alt="Logo" />
          <Logo src={images.logo} alt="Logo" />
          <Title>{isSignUp ? "Rejestracja" : "Logowanie"}</Title>

          {/* Formularz logowania */}
          {isSignUp ? (
            <>
              <FormField
                title="Email"
                value={email}
                handleChangeText={setEmail}
                otherStyles="marginTop: 28"
                type="email-address"
                placeholder=""
              />
              <FormField
                title="Hasło"
                value={password}
                handleChangeText={setPassword}
                otherStyles="marginTop: 28"
                type="default"
                placeholder=""
              />
              <CustomButton title="Utwórz konto" handlePress={signUp} />
              <div
                style={{
                  justifyContent: "center",
                  paddingTop: 20,
                  display: "flex",
                  flexDirection: "row",
                  gap: 8,
                }}>
                <span style={{ fontSize: 18, color: "#A0A0A0" }}>
                  Masz już konto?
                </span>
                <TextLink onClick={() => setIsSignUp(false)}>
                  Zaloguj się
                </TextLink>
              </div>
            </>
          ) : (
            <>
              <FormField
                title="Email"
                value={email}
                handleChangeText={setEmail}
                otherStyles="marginTop: 28"
                type="email-address"
                placeholder=""
              />
              <FormField
                title="Hasło"
                value={password}
                handleChangeText={setPassword}
                otherStyles="marginTop: 28"
                type="default"
                placeholder=""
              />
              <CustomButton title="Zaloguj" handlePress={signIn} />
              <div
                style={{
                  justifyContent: "center",
                  paddingTop: 20,
                  display: "flex",
                  flexDirection: "row",
                  gap: 8,
                }}>
                <span style={{ fontSize: 18, color: "#A0A0A0" }}>
                  Nie masz konta?
                </span>
                <TextLink onClick={() => setIsSignUp(true)}>
                  Utwórz konto
                </TextLink>
              </div>
            </>
          )}
        </FormContainer>
      </ScrollContainer>
    </Container>
  );
};

export default AuthScreen;
