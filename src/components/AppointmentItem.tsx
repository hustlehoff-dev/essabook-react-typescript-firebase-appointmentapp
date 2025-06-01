import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Appointment } from "../lib/types";
import {
  getSafeStatus,
  getStatusText,
  statusColors,
} from "../lib/AppointmentStatus";

type Props = {
  appointment: Appointment;
  isPast: boolean;
  isNext: boolean;
  onRebook: (appointment: Appointment) => void;
  onDelete: (clientName: string, id: string) => void;
  onReminder: (id: string) => void;
  onCall: (phone: string) => void;
};

const AppointmentCard = ({
  appointment,
  isPast,
  isNext,
  onRebook,
  onDelete,
  onReminder,
  onCall,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <AppointmentItem
      ref={ref}
      $past={isPast}
      $next={isNext}
      status={appointment.status}
      onClick={toggleOpen}>
      <ItemContent>
        <ItemContentLeft>
          <AppointmentTime status={appointment.status}>
            {appointment.time}
          </AppointmentTime>
          <ClientName>{appointment.clientName}</ClientName>
        </ItemContentLeft>
        <ItemContentRight>
          <Status status={appointment.status}>
            {getStatusText(appointment.status)}
          </Status>
          <ClientPhone>{appointment.clientPhone}</ClientPhone>
        </ItemContentRight>
      </ItemContent>

      {isOpen && (
        <ButtonContainer onClick={(e) => e.stopPropagation()}>
          {isPast ? (
            <Button onClick={() => onRebook(appointment)}>Umów ponownie</Button>
          ) : (
            <>
              <Button onClick={() => onCall(appointment.clientPhone)}>
                Zadzwoń
              </Button>
              <Button
                onClick={() =>
                  onDelete(appointment.clientName, appointment.id)
                }>
                Usuń
              </Button>
              <Button onClick={() => onReminder(appointment.id)}>
                Przypomnij
              </Button>
            </>
          )}
          {/*<Button onClick={close}>X</Button>*/}
        </ButtonContainer>
      )}
    </AppointmentItem>
  );
};

export default AppointmentCard;

// --- Styled components (możesz przenieść później do osobnego pliku)

const AppointmentItem = styled.div<{
  $past: boolean;
  $next: boolean;
  status: string;
}>`
  padding: 8px 16px;
  width: 100%;
  max-width: 420px;
  backdrop-filter: blur(12px);
  border-radius: 10px;
  border: 1px solid rgba(50, 50, 50, 0.5);
  opacity: ${(props) => (props.$past ? 0.3 : 1)};
  background-color: ${(props) =>
    statusColors[getSafeStatus(props.status)].background};
  box-shadow: ${(props) => statusColors[getSafeStatus(props.status)].shadow};
`;

const ItemContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ItemContentLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`;

const ItemContentRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  align-items: flex-end;
`;

const ClientName = styled.p`
  font-size: 1.25em;
  font-weight: 600;
  margin: 0;
`;

const ClientPhone = styled.p`
  font-size: 1.25em;
  font-weight: 600;
  margin: 0 0 0.5em 0;
`;

const Status = styled.p<{ status: string }>`
  font-size: 1.5em;
  font-weight: 600;
  margin: 0;
  color: ${(props) => statusColors[getSafeStatus(props.status)].text};
`;

const AppointmentTime = styled.p<{ status: string }>`
  font-size: 1.5em;
  font-weight: 600;
  margin: 0;
  color: ${(props) => statusColors[getSafeStatus(props.status)].text};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: rgba(205, 205, 224, 0.75);
  color: black;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  font-size: 16px;
`;
