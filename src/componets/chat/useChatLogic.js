import { useState, useEffect, useRef } from "react";

export default function useChatLogic() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const wsRef = useRef(null);
    const indexRef = useRef(1);

    useEffect(() => {
        const ws = new WebSocket("ws://77.237.243.163:8000/chat/admin?chat_id=id&token=oBd-k41TmMqib1QYalke7HRCbk_HOtE0nw1YcdkibPc=");
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


    const handleStep = (step) => {
        setMessages((prev) => {
            let updated = [...prev];

            if (step.type === "response") {
                // Si es el primer chunk, creamos un nuevo mensaje
                if (step.first_chunk || updated.length === 0) {
                    updated.push(`\n\n${step.response}`);
                } else {
                    // Concatenamos al último mensaje (sin salto de línea)
                    const lastIndex = updated.length - 1;
                    updated[lastIndex] = updated[lastIndex] + step.response;
                }
                return updated;
            }

            if (step.type === "query") {
                return [...updated, `\n\n## ${step.query}`];
            }

            if (step.type === "data") {
                return [...updated, DataToString(step.data)];
            }

            if (step.type === "step") {
                updated.push(`### ${step.step}\n${step.message}`);
                return updated;
                // Eliminar el último mensaje
                updated = updated.slice(0, updated.length - 1);
            }

            return updated;
        });
    };


    const sendMessage = () => {
        if (input.trim() && wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(input);
            setMessages((prev) => [...prev, `${input}\n---`]);
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

function DataToString(data) {
    let markdownText = '';

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];

            if (typeof value == null) {
                markdownText += `__Not ${key} found__`
                return markdownText;
            }
            else {
                markdownText += `### ${key}:\n`; // título de sección para cada clave
            }

            if (typeof value === 'string') {
                // Si el valor es string, lo añado directo
                markdownText += `${value}\n`;
            } else if (Array.isArray(value)) {
                // Si es lista de strings, mapear a lista Markdown
                value.forEach(item => {
                    markdownText += `- ${item}\n`;
                });
                markdownText += '\n';
            } else if (typeof value === 'object') {
                // Si es un objeto, convertir a JSON formateado
                markdownText += '```json\n' + JSON.stringify(value, null, 2) + '\n```\n';
            }
            // Puedes agregar más tipos si es necesario
        }
    }
    return markdownText;
}