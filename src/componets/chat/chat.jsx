import useChatLogic from "./useChatLogic";

import { useState, useRef, useEffect } from 'react';
import "./style/desktop.css";
import { Icon } from '@iconify/react/dist/iconify.js'

const FAQList = ({
  questions = [
    "¿Que es Technova?",
    "¿Qué tipos de consultas puedo hacer?",
    "Envia la informacion de las ventas a Pedro Alvarez",
    "Envia la informacion de las ventas a cada uno de los clientes que viven en Estados Unidos",
    "¿Cuántos productos principales vende TechNova? ",
    "¿Cuál fue el precio promedio de venta en Chile? ",
    "Muestrame una lista con nuestros clientes",
    "Busca la informacion de las ventas, mandale esta informacion de ventas a Pedro Alvarez por correo",
    "Busca la informacion de las ventas de la empresa y mandale esta informacion de ventas a cada uno de los clientes de Estados Unidos por correo electronico",
    "Manda la informacion de las todas las ventas generales a cada uno de los clientes de Chile, por correo electronico y por mensaje al telefono.",
  ],
  onSelectQuestion,
  inputRef,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <div className="faq-container">
      {questions.map((question, index) => (
        <div
          key={index}
          className="faq-item"
          onClick={() => {
            onSelectQuestion(question);
            inputRef.current?.focus();
          }}
        >
          {question}
        </div>
      ))}
    </div>
  );
};

const Chat = () => {
  const { messages, input, setInput, sendMessage, connectionStatus } = useChatLogic();
  const [showFAQ, setShowFAQ] = useState(true);
  const inputRef = useRef(null);

  const _sendMessage = () => {
    sendMessage();
    setShowFAQ(false);
  }

  const handleFAQClick = (question) => {
    setInput(question);
    // _sendMessage();
  };

  let screen = ConnectionScreens(connectionStatus)
  if (screen) {
    return screen;
  }

  return (
    <div className="chat-container">
      <p className="chat-title">🌐 Technova Agent </p>

      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className="chat-message">
            {msg}
          </div>
        ))}

        {showFAQ && (
          <FAQList
            onSelectQuestion={handleFAQClick}
            inputRef={inputRef}
            isVisible={showFAQ}
          />
        )}
      </div>

      <div className="input-container">
        <input
          ref={inputRef}
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && _sendMessage()}
          placeholder="Ask anything ..."
        />
        <button className="chat-button" onClick={_sendMessage}>
          <Icon icon="majesticons:send" />
        </button>
      </div>
    </div>
  );
};

const ConnectionScreens = (connectionStatus) => {
  if (connectionStatus === 'connecting') {
    return (
      <div className="connecting-screen">
        🌐 Connecting...
      </div>
    );
  }

  if (connectionStatus === 'disconnected') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '20px',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{ fontSize: '24px', color: '#ef4444' }}>
          ❌ No se pudo establecer conexión con el servidor
        </div>
        <div style={{ fontSize: '16px', color: '#6b7280' }}>
          Verifica que el servidor esté activo
          {/* Verifica que el servidor esté activo en {vps_url} */}
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          🔄 Reintentar conexión
        </button>
      </div>
    );
  }
  return null
}


export default Chat;
