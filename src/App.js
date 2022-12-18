import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/ext-language_tools";

function App() {
  const [query1, setQuery1] = useState("{\n  \"query\": {\n    \n  }\n}");
  return (
    <div className="app">
      <h1>Compare Search Results</h1>
      <div className="search">
        <input type="text" placeholder="Search..." />
        <button>Search</button>
      </div>
      <div className="query1">
        <h2>Query 1</h2>
        <div>
          <label>Index</label>
          <input type="text" placeholder="Index..." />
        </div>
        <div>
          <label>Query</label>
          <AceEditor
            placeholder="Placeholder Text"
            mode="json"
            theme="textmate"
            name="query1"
            onChange={setQuery1}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={query1}
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

      </div>
    </div>
  );
}

export default App;
