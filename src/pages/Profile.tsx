import styled from "styled-components";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthProvider";

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();

  if (loading) return null;
  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log("Wylogowano");
      navigate("/auth");
    });
  };

  const handleSubscription = () => {
    alert("Przejdź do opłacenia subskrypcji (wkrótce)");
  };

  return (
    <Wrapper>
      <h2>Profil</h2>
      <UserInfo>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </UserInfo>
      <Buttons>
        <button onClick={handleSubscription}>Opłać subskrypcję</button>
        <button onClick={handleLogout}>Wyloguj się</button>
      </Buttons>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 2rem;
  background: #121212;
  color: white;
`;

const UserInfo = styled.div`
  margin-bottom: 2rem;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  button {
    padding: 12px;
    font-size: 16px;
    background-color: #ff7f00;
    color: black;
    border: none;
    border-radius: 10px;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
  }
`;

export default Profile;
