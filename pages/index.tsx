import { useState, useEffect } from 'react';

export default function Home() {
  const [projects, setProjects] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [newProject, setNewProject] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: string; message: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem('cs-copilot-projects') || '[]');
    setProjects(storedProjects);
    if (storedProjects.length > 0) {
      setSelectedProject(storedProjects[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedProject) {
      const storedHistory = JSON.parse(localStorage.getItem(`chat-${selectedProject}`) || '[]');
      setChatHistory(storedHistory);
    }
  }, [selectedProject]);

  const handleNewProject = () => {
    if (newProject.trim() === '') return;
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('cs-copilot-projects', JSON.stringify(updatedProjects));
    setSelectedProject(newProject);
    setNewProject('');
    setChatHistory([]);
  };

  const handleSubmit = async () => {
    if (!query && !file) return;
    setLoading(true);

    const newHistory = [...chatHistory, { sender: 'User', message: query }];
    setChatHistory(newHistory);
    localStorage.setItem(`chat-${selectedProject}`, JSON.stringify(newHistory));

    const formData = new FormData();
    formData.append('query', query);
    if (file) formData.append('file', file);

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    const updatedHistory = [
      ...newHistory,
      { sender: 'Assistant', message: data.result || 'No response' },
    ];

    setChatHistory(updatedHistory);
    localStorage.setItem(`chat-${selectedProject}`, JSON.stringify(updatedHistory));
    setQuery('');
    setFile(null);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h1>CS Co-Pilot</h1>

      <div style={{ marginBottom: 10 }}>
        <label>
          Select Project:{' '}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            {projects.map((proj) => (
              <option key={proj}>{proj}</option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Create new project"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
        />
        <button onClick={handleNewProject}>Add</button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <textarea
        rows={3}
        style={{ width: '100%', marginBottom: 10 }}
        placeholder="Ask your question or draft..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>

      <div style={{ marginTop: 20 }}>
        <h3>Chat History - {selectedProject}</h3>
        <div style={{ background: '#f7f7f7', padding: 10, borderRadius: 5 }}>
          {chatHistory.map((msg, i) => (
            <p key={i}>
              <strong>{msg.sender}:</strong> {msg.message}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
