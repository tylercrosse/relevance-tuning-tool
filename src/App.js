import { useState } from "react";
import "./App.css";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/ext-language_tools";

function App() {
  const [query, setQuery] = useState("");
  const [query1DSL, setQuery1DSL] = useState('{\n  "query": {\n    \n  }\n}');
  const [results1, setResults1] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/search", {
      method: "POST",
      body: JSON.stringify({
        index: "demo.demo.1",
        query: JSON.parse(query1DSL),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((data) => {
        setResults1(data);
      });
    });
  };

  return (
    <div className="app">
      <h1>Compare Search Results</h1>
      <div className="index">
        <label>Index</label>
        <input type="text" placeholder="Index..." />
      </div>
      <div className="search">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSubmit}>Search</button>
      </div>
      <div className="query1">
        <h2>Query 1</h2>
        <div>
          <label>Query</label>
          <AceEditor
            placeholder="Placeholder Text"
            mode="json"
            theme="textmate"
            name="query1"
            onChange={setQuery1DSL}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={query1DSL}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </div>
      </div>
      <div className="results">
        <h2>Results</h2>
        <pre>
          <code>{JSON.stringify(results1.hits, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
}

export default App;
