import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import "./style/desktop.css"

function Home() {
  const navigate = useNavigate();

  const goToChat = () => {
    navigate('/chat');
  };

  return (
    <div className="Home">
      <header className="Home-header">
        <h1>Welcome to Technova Chat</h1>
        <p>This is a simple home page for our AI chatbot connected to Technova’s MCP servers. Start a smart, real-time conversation powered by advanced technology.</p>
        <button className='button-chat' onClick={goToChat}>
          Start Chat
        </button>

      </header>
    </div>
  );
}

export default Home