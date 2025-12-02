import useChatLogic from "./useChatLogic";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import "./style/desktop.css";

const Chat = () => {
  const { messages, input, setInput, sendMessage } = useChatLogic();

  return (
    <div className="chat-container">
      <h2 className="chat-title">Technova Agent</h2>

      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className="chat-message">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {msg}
            </ReactMarkdown>
            {/* <ReactMarkdown>
              {msg}
            </ReactMarkdown> */}
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
          placeholder="Escribe un mensaje..."
        />
        <button className="chat-button" onClick={sendMessage}>
          Enviar
        </button>
      </div>
    </div >
  );
};

export default Chat;
