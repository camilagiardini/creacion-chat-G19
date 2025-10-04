import React from "react";
import Popup from "reactjs-popup";
import styles from "./NewChatPopup.module.css";
import Input from "./Input"; // asumiendo que ya tenés un componente Input

const NewChatPopup = ({
  isOpen,
  closePopup,
  mailInput,
  setMailInput,
  newChat,
}) => {
  return (
    <Popup
      open={isOpen}
      onClose={closePopup}
      modal
      nested
      closeOnDocumentClick={false}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Nuevo Chat</h2>
        </div>

        <div className={styles.content}>
          <p>Ingresa el mail del usuario con quien quieres chatear</p>
          <Input
            type="mail"
            placeholder="ejemplo@mail.com"
            value={mailInput}
            onChange={(e) => setMailInput(e.target.value)}
            use="mailNewChat"
          />
        </div>

        <div className={styles.actions}>
          <button onClick={closePopup} className={styles.cancelBtn}>
            Cancelar
          </button>
          <button onClick={newChat} className={styles.createBtn}>
            Crear chat
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default NewChatPopup;
