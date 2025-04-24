import React from "react";
import styled from "styled-components";

type CustomButtonProps = {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  containerStyles = "",
  textStyles = "",
  isLoading = false,
}) => {
  return (
    <Button
      onClick={handlePress}
      disabled={isLoading}
      isLoading={isLoading}
      className={containerStyles}>
      <span className={`button-text ${textStyles}`}>{title}</span>
    </Button>
  );
};

export default CustomButton;

const Button = styled.button<{ isLoading: boolean }>`
  background-color: var(--secondary-color);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 62px;
  min-width: 250px;
  margin: 0 auto;
  padding: 10px 20px;
  cursor: pointer;
  transition: opacity 0.3s ease;
  opacity: ${({ isLoading }) => (isLoading ? 0.5 : 1)};

  &:disabled {
    cursor: not-allowed;
  }

  .button-text {
    color: var(--primary-color);
    font-size: 18px;
    font-weight: 600;
  }
`;
