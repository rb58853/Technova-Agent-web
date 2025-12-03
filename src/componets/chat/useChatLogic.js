import { useState, useEffect, useRef, useCallback } from "react";
import { UserQueryComponent, QueryComponent, DataComponent, StepComponent, ResponseComponent } from './components/ChatComponents';

// URLs de WebSocket
const vps_url = "ws://77.237.243.163:8000/chat/admin?chat_id=id&token=oBd-k41TmMqib1QYalke7HRCbk_HOtE0nw1YcdkibPc="
const localhost_url = "ws://localhost:8000/chat/admin?chat_id=id&token=oBd-k41TmMqib1QYalke7HRCbk_HOtE0nw1YcdkibPc="

export default function useChatLogic() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(vps_url);
    wsRef.current = ws;

    ws.onopen = () => console.log("✅ Conectado al servidor WebSocket");

    ws.onmessage = (event) => {
      const data = event.data;
      if (data === "--next") return;
      try {
        const step = JSON.parse(data);
        handleStep(step);
      } catch (err) {
        console.error("Error procesando mensaje:", data, err);
      }
    };

    ws.onclose = () => console.log("❌ Conexión cerrada");
    ws.onerror = (err) => console.error("⚠️ Error WebSocket:", err);

    return () => ws.close();
  }, []);

  const handleStep = useCallback((step) => {
    setMessages((prev) => {
      let updated = [...prev];

      if (step.type === "response") {
        if (step.first_chunk || updated.length === 0) {
          updated.push(<ResponseComponent key={`response-${updated.length}`} response={step.response} />);
        } else {
          const lastIndex = updated.length - 1;
          // Obtener el texto actual del último componente sin leer directamente props.children
          const updatedResponse = updated[lastIndex].props.response + step.response;
          updated[lastIndex] = <ResponseComponent key={`response-${lastIndex}`} response={updatedResponse} />;
        }
      }

      if (step.type === "query") {
        updated.push(<QueryComponent key={`query-${Date.now()}`} query={step.query} />);
      }

      if (step.type === "data") {
        updated.push(<DataComponent key={`data-${Date.now()}`} data={step.data} />);
      }

      if (step.type === "step") {
        updated.push(<StepComponent
          key={`step-${Date.now()}`}
          step={step.step}
          message={step.message}
        />);
      }

      return updated;
    });
  }, []);

  const sendMessage = () => {
    if (input.trim() && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(input);
      setMessages((prev) => [
        ...prev,
        <UserQueryComponent input={input}/>,
        <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '8px 0' }} key={`divider-${Date.now()}`} />
      ]);
      setInput("");
    }
  };

  return {
    messages,
    input,
    setInput,
    sendMessage,
  };
}
