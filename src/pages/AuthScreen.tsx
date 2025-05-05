// screens/AuthScreen.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../lib/AuthProvider";
import { images } from "../constants";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import styled from "styled-components";

// Styled components
const Container = styled.div`
  background-color: #121212;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

const Logo = styled.img`
  width: 100px;
  height: 100px;
`;

const Title = styled.h2`
  color: white;
  font-size: 24px;
  margin-top: 16px;
  margin-bottom: 24px;
`;

const TextLink = styled.span`
  font-size: 18px;

  font-weight: 600;
  color: #ff8c00;
  cursor: pointer;
`;

const LinkRow = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: center;
`;

const InfoText = styled.span`
  font-size: 18px;
  color: #a0a0a0;
`;

interface AuthScreenProps {
  signUpMode?: boolean;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ signUpMode = false }) => {
  const [isSignUp, setIsSignUp] = useState(signUpMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect jeśli user już jest zalogowany
  useEffect(() => {
    if (!loading && user) {
      navigate("/home");
    }
  }, [user, loading, navigate]);

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      // User automatycznie się zaktualizuje przez onAuthStateChanged
    } catch (error: any) {
      console.error(error);
      alert("Nieprawidłowe dane. Spróbuj ponownie.");
    }
  };

  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center" }}>Ładowanie...</div>
    );
  }

  return (
    <Container>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <Logo src={images.logo} alt="Logo" />
        <Title>{isSignUp ? "Rejestracja" : "Logowanie"}</Title>

        <FormField
          title="Email"
          value={email}
          handleChangeText={setEmail}
          otherStyles="marginTop: 16"
          type="default"
          placeholder=""
        />
        <FormField
          title="Hasło"
          value={password}
          handleChangeText={setPassword}
          otherStyles="marginTop: 16"
          type="default"
          placeholder=""
        />

        <CustomButton
          title={isSignUp ? "Utwórz konto" : "Zaloguj się"}
          handlePress={handleAuth}
          containerStyles="marginTop: 28"
        />

        <LinkRow>
          <InfoText>
            {isSignUp ? "Masz już konto?" : "Nie masz konta?"}
          </InfoText>
          <TextLink onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Zaloguj się" : "Utwórz konto"}
          </TextLink>
        </LinkRow>
      </div>
    </Container>
  );
};

export default AuthScreen;
