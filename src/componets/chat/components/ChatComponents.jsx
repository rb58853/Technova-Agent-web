import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './styles.css';


// Componente para queries
export const UserQueryComponent = ({ input }) => (
    <div className="user-query-container">
        💬 {input}
    </div>
);

// Componente para queries
export const QueryComponent = ({ query }) => (
    <div className="query-container">
        {/* <h3 className="query-title">🔍 Consulta</h3> */}
        <h4 className="query-text">🔍 {query}</h4>
    </div>
);

// Componente para datos
export const DataComponent = ({ data }) => (
    <div className="data-container">
        {/* <h3 className="data-title">📊 Datos</h3> */}
        {Object.entries(data).map(([key, value]) => (
            <div key={key} className="data-section">
                {key!="querys"?<h4 className="data-key">{key}:</h4>:<div></div>}
                {typeof value === 'string' && (
                    <p className="data-string">{value}</p>
                )}
                {Array.isArray(value) && (
                    <ul className="data-list">
                        {value.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                )}
                {typeof value === 'object' && !Array.isArray(value) && value !== null && (
                    <pre className="data-json">{JSON.stringify(value, null, 2)}</pre>
                )}
            </div>
        ))}
    </div>
);

// Componente para steps
export const StepComponent = ({ step, message }) => (
    <div className="step-container">
        <h4 className="step-title">📋 {step}</h4>
        <p className="step-message">{message}</p>
    </div>
);



// <div>
//     {response}
// </div>

// Componente para responses
export const ResponseComponent = ({ response }) => (
    <div className="response-container">
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
            {response}
        </ReactMarkdown>
    </div>
);

///Busca la informacion de las ventas, con esa informacion reaiza un analisis del mercado y expone como podriamos mejorar nuestras ventas. Luego enviale ese anailis a los clientes Chilenos
