import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, Bot, User, Menu } from 'lucide-react';
import './ChatArea.css';

const ChatArea = ({ history, onSendMessage, loading, onMenuClick }) => {
    const [query, setQuery] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [history, loading]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim() && !loading) {
            onSendMessage(query.trim());
            setQuery('');
        }
    };

    const formatText = (text) => {
        if (!text) return null;
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="chat-container">
            <button className="menu-toggle" onClick={onMenuClick}>
                <Menu size={24} />
            </button>

            <div className="messages-list">
                {history.length === 0 && (
                    <div className="empty-chat">
                        <Bot size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
                        <h2>Welcome to PrivateQA</h2>
                        <p>Upload a document and start asking questions.</p>
                    </div>
                )}

                {history.map((msg, index) => (
                    <div key={index} className={`message-row ${msg.type}`}>
                        <div className={`avatar ${msg.type}`}>
                            {msg.type === 'user' ? <User size={20} /> : <Bot size={20} />}
                        </div>

                        <div className={`message-bubble ${msg.type}`}>
                            <div className="message-content">
                                {formatText(msg.text)}
                            </div>

                            {msg.citation && (
                                <div className="citation-block">
                                    <div className="citation-header">
                                        <FileText size={12} />
                                        <span>Source: {msg.citation.docName}</span>
                                    </div>
                                    <div className="citation-body">
                                        {formatText(msg.citation.text)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="message-row bot">
                        <div className="avatar bot"><Bot size={20} /></div>
                        <div className="message-bubble bot loading">
                            <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', gap: '10px' }}>
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask a question..."
                        className="input-box"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={!query.trim() || loading}
                        className="send-btn"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatArea;
