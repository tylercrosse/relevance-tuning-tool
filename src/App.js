import { useState, useMemo } from "react";
import "./App.css";
import useLocalStorage from "./useLocalStorage";
import QueryComparison from "./QueryComparison";
import compareResults from "./utils/compareResults";

function App() {
  const [query, setQuery] = useState("");
  const [searchEndpoint, setSearchEndpoint] = useLocalStorage(
    "searchEndpoint",
    ""
  );
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  function buildQueryDSL(queryDSL) {
    return JSON.parse(queryDSL.replace(/%searchQuery%/g, query));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FETCHING");
    const request1 = fetch("http://localhost:3000/search", {
      method: "POST",
      body: JSON.stringify({
        searchEndpoint,
        index,
        query: buildQueryDSL(query1DSL),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const request2 = fetch("http://localhost:3000/search", {
      method: "POST",
      body: JSON.stringify({
        searchEndpoint,
        index,
        query: buildQueryDSL(query2DSL),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const [resp1, resp2] = await Promise.all([request1, request2]);
    console.log("RECIEVED");
    const data1 = await resp1.json();
    const data2 = await resp2.json();
    setResults1(data1);
    setResults2(data2);
  };

  // cache the comparison results so we don't have to recompute them on every render
  const comparisonResults1 = useMemo(
    () => compareResults(results1.hits, results2.hits),
    [results1.hits, results2.hits]
  );
  const comparisonResults2 = useMemo(
    () => {
      console.log("PROCESSING");
      return compareResults(results2.hits, results1.hits)
    },
    [results1.hits, results2.hits]
  );

  return (
    <main className="app">
      <header className="app_header">
        <h1>Relevance Tuning Tool</h1>

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
            onKeyDown={handleKeyDown}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSubmit}>Search</button>
        </div>
      </header>
      <div className="queries">
        <QueryComparison
          queryDSL={query1DSL}
          setQueryDSL={setQuery1DSL}
          raw={results1.hits}
          hits={comparisonResults1}
          number={1}
        />
        <QueryComparison
          queryDSL={query2DSL}
          setQueryDSL={setQuery2DSL}
          raw={results2.hits}
          hits={comparisonResults2}
          number={2}
        />
      </div>
    </main>
  );
}

export default App;
