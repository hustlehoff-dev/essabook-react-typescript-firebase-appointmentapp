import React, { useState } from "react";
import styled from "styled-components";

type FormFieldProps = {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (e: any) => void;
  otherStyles: string;
  type: string;
};

const Container = styled.div<{ otherStyles: string }>`
  margin-top: 10px;
  ${(props) => props.otherStyles}
`;

const Label = styled.label`
  font-size: 14px;
  color: #a0a0a0;
  font-weight: 500;
`;

const InputWrapper = styled.div`
  width: 100%;
  height: 50px;
  background-color: #2d2d2d;
  margin-top: 8px;
  border-radius: 20px;
  border: 2px solid #444444;
  display: flex;
  align-items: center;
  padding: 0 16px;
`;

const InputField = styled.input`
  flex: 1;
  font-size: 16px;
  color: white;
  font-weight: 600;
  background: transparent;
  border: none;
  outline: none;
`;

const EyeIconWrapper = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
`;

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  handleChangeText,
  otherStyles,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <Container otherStyles={otherStyles}>
      <Label>{title}</Label>
      <InputWrapper>
        <InputField
          type={title === "Password" && !showPassword ? "password" : "text"}
          value={value}
          placeholder={placeholder}
          onChange={(e) => handleChangeText(e.target.value)}
        />
        {title === "Password" && (
          <EyeIconWrapper onClick={() => setShowPassword(!showPassword)}>
            <img
              src={!showPassword ? "/icons/eye.svg" : "/icons/eye-hide.svg"} // Zakładając, że masz ikony w folderze public
              alt="eye icon"
              width="24"
              height="24"
            />
          </EyeIconWrapper>
        )}
      </InputWrapper>
    </Container>
  );
};

export default FormField;
