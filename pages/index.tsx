// pages/index.tsx

import { useState, useEffect } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [selectedProject, setSelectedProject] = useState("Default Project");
  const [projectChats, setProjectChats] = useState<Record<string, string[]>>({
    "Default Project": [],
  });

  const projects = Object.keys(projectChats);

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    const answer = data.result || data.answer || "No response";
    setResponse(answer);

    // Save chat to selected project's history
    setProjectChats((prev) => {
      const updated = { ...prev };
      updated[selectedProject] = [...(updated[selectedProject] || []), `You: ${query}`, `AI: ${answer}`];
      return updated;
    });

    setQuery("");
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProject = e.target.value;
    setSelectedProject(newProject);
    if (!projectChats[newProject]) {
      setProjectChats((prev) => ({ ...prev, [newProject]: [] }));
    }
    setResponse("");
  };

  const handleNewProject = () => {
    const name = prompt("Enter new project/company name:");
    if (name && !projectChats[name]) {
      setProjectChats((prev) => ({ ...prev, [name]: [] }));
      setSelectedProject(name);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: "1rem" }}>
      <h1>Welcome to CS Co-Pilot</h1>

      <label>
        Select Project:&nbsp;
        <select value={selectedProject} onChange={handleProjectChange}>
          {projects.map((proj) => (
            <option key={proj} value={proj}>
              {proj}
            </option>
          ))}
        </select>
        &nbsp;
        <button onClick={handleNewProject}>+ New Project</button>
      </label>

      <form onSubmit={handleQuerySubmit} style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Ask something or draft a form..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: "80%" }}
        />
        <button type="submit">Submit</button>
      </form>

      {response && (
        <div style={{ marginTop: "1rem", background: "#f0f0f0", padding: "1rem" }}>
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <h3>Chat History for {selectedProject}</h3>
        <div style={{ whiteSpace: "pre-wrap" }}>
          {(projectChats[selectedProject] || []).map((msg, idx) => (
            <p key={idx}>{msg}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

