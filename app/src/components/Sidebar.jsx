import React from 'react';
import { Upload, FileText, Brain, X } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ documents, onUpload, onSelect, isOpen, onClose }) => {
    const handleUpload = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onUpload(e.target.files[0]);
        }
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                onClick={onClose}
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: isOpen ? 'block' : 'none' }}
            ></div>

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="flex items-center gap-2">
                        <Brain size={24} color="var(--accent)" />
                        <span className="brand-text">PrivateQA</span>
                    </div>
                    <button className="close-sidebar-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <label className="btn btn-primary upload-btn cursor-pointer">
                    <Upload size={18} />
                    <span>Add Documents</span>
                    <input
                        type="file"
                        accept=".txt,.md,.pdf"
                        onChange={handleUpload}
                        className="hidden"
                    />
                </label>

                <div className="doc-section">
                    <h3 className="doc-list-title">Your Knowledge</h3>
                    <ul className="doc-list">
                        {documents.length > 0 ? (
                            documents.map((doc) => (
                                <li key={doc.id} className="doc-item" onClick={() => { onSelect(doc); onClose(); }}> {/* Close sidebar on selection (mobile) */}
                                    <FileText size={16} />
                                    <span className="doc-name">{doc.name}</span>
                                </li>
                            ))
                        ) : (
                            <li className="empty-state">No files uploaded. Start by adding some text.</li>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
