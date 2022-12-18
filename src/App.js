import { useState } from "react";
import "./App.css";
import AceEditor from "react-ace";
import useLocalStorage from "./useLocalStorage";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/ext-language_tools";

function Query(props) {
  return (
    <article className="query">
      <section>
        <h2>Query {props.number}</h2>
        <AceEditor
          placeholder="Placeholder Text"
          width="100%"
          mode="json"
          theme="textmate"
          name="query1"
          onChange={props.setQueryDSL}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={props.queryDSL}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
      </section>
      <section className="results">
        <header className="results_header">
          <h2>Results {props.number}</h2>
          <span>{props.hits?.total?.value} Items</span>
        </header>
        <pre className="results_values">
          <code>{JSON.stringify(props.hits, null, 2)}</code>
        </pre>
      </section>
    </article>
  );
}

function App() {
  const [query, setQuery] = useState("");
  const [searchEndpoint, setSearchEndpoint] = useLocalStorage("searchEndpoint", "");
  const [index, setIndex] = useLocalStorage("index", "demo.demo.1");
  const [query1DSL, setQuery1DSL] = useLocalStorage(
    "query1DSL",
    '{\n  "query": {\n    \n  }\n}'
  );
  const [query2DSL, setQuery2DSL] = useLocalStorage(
    "query2DSL",
    '{\n  "query": {\n    \n  }\n}'
  );
  const [results1, setResults1] = useState({});
  const [results2, setResults2] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/search", {
      method: "POST",
      body: JSON.stringify({
        index,
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
    fetch("http://localhost:3000/search", {
      method: "POST",
      body: JSON.stringify({
        index,
        query: JSON.parse(query2DSL),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((data) => {
        setResults2(data);
      });
    });
  };

  return (
    <main className="app">
      <header className="app_header">
        <h1>Compare Search Results</h1>

        <details className="configure">
          <summary>⚙️ Configure</summary>
          <div className="field">
            <label>Search Endpoint</label>
            <input
              type="text"
              placeholder="Search Endpoint..."
              value={searchEndpoint}
              onChange={(e) => setSearchEndpoint(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Index</label>
            <input
              type="text"
              placeholder="Index..."
              value={index}
              onChange={(e) => setIndex(e.target.value)}
            />
          </div>
        </details>

        <div className="search">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSubmit}>Search</button>
        </div>
      </header>
      <div className="queries">
        <Query
          queryDSL={query1DSL}
          setQueryDSL={setQuery1DSL}
          hits={results1.hits}
          number={1}
        ></Query>
        <Query
          queryDSL={query2DSL}
          setQueryDSL={setQuery2DSL}
          hits={results2.hits}
          number={2}
        ></Query>
      </div>
    </main>
  );
}

export default App;
