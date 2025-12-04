import useChatLogic from "./useChatLogic";
import "./style/desktop.css";

const Chat = () => {
  const { messages, input, setInput, sendMessage } = useChatLogic();

  return (
    <div className="chat-container">
      <p className="chat-title">🌐 Technova Agent </p>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className="chat-message">
            {msg}
          </div>
        ))
        }
      </div >

      <div className="input-container">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask anything ..."
        />
        <button className="chat-button" onClick={sendMessage}>
          →
        </button>
      </div>

    </div >
  );
};

export default Chat;
