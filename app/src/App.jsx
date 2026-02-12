import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { processFile, searchKnowledgeBase } from './utils/rag';

function App() {
  const [documents, setDocuments] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleUpload = async (file) => {
    try {
      const processedDoc = await processFile(file);
      setDocuments(prev => [...prev, processedDoc]);
      setHistory(prev => [...prev, {
        type: 'bot',
        text: `Uploaded **${file.name}** successfully. I have processed **${processedDoc.chunks.length}** chunks/sentences.`
      }]);
    } catch (error) {
      console.error(error);
      alert('Failed to process file');
    }
  };

  const handleSendMessage = async (query) => {
    setLoading(true);
    const newHistory = [...history, { type: 'user', text: query }];
    setHistory(newHistory);

    setTimeout(() => {
      const results = searchKnowledgeBase(query, documents);

      if (results.length > 0) {
        const topResult = results[0];

        setHistory(prev => [...prev, {
          type: 'bot',
          text: topResult.text,
          citation: {
            docName: topResult.docName,
            text: topResult.text,
            score: topResult.score
          }
        }]);
      } else {
        setHistory(prev => [...prev, {
          type: 'bot',
          text: "I couldn't find any information matching your query in the uploaded documents."
        }]);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="flex bg-primary h-full w-full relative">
      <Sidebar
        documents={documents}
        onUpload={handleUpload}
        onSelect={(doc) => console.log('Selected', doc)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <ChatArea
        history={history}
        onSendMessage={handleSendMessage}
        loading={loading}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
    </div>
  );
}

export default App;
