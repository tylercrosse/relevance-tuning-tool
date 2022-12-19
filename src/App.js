import { useState } from "react";
import "./App.css";
import useLocalStorage from "./useLocalStorage";
import QueryComparison from "./QueryComparison";

// Compare the two lists of results to see the relative position of documents in each list. If a document is in both lists, indicate when a document is higher, lower or stayed the same.
function compareResults(theseResults, otherResults) {
  const theseResultsMap = {};
  const otherResultsMap = {};
  theseResults?.hits?.forEach((hit, index) => {
    theseResultsMap[hit._id] = index;
  });
  otherResults?.hits?.forEach((hit, index) => {
    otherResultsMap[hit._id] = index;
  });
  return theseResults?.hits.map((hit) => {
    let status = "different";
    let delta = 0;
    if (otherResultsMap[hit._id] !== undefined) {
      delta = otherResultsMap[hit._id] - theseResultsMap[hit._id];
      if (theseResultsMap[hit._id] < otherResultsMap[hit._id]) {
        status = "higher";
      } else if (theseResultsMap[hit._id] > otherResultsMap[hit._id]) {
        status = "lower";
      } else {
        status = "same";
      }
    }
    return {
      ...hit,
      status,
      delta
    }
  });
}

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

  const buildQueryDSL = (queryDSL) =>
    JSON.parse(queryDSL.replace(/%searchQuery%/g, query));

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/search", {
      method: "POST",
      body: JSON.stringify({
        searchEndpoint,
        index,
        query: buildQueryDSL(query1DSL),
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
        searchEndpoint,
        index,
        query: buildQueryDSL(query2DSL),
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
          hits={compareResults(results1.hits, results2.hits)}
          number={1}
        />
        <QueryComparison
          queryDSL={query2DSL}
          setQueryDSL={setQuery2DSL}
          raw={results2.hits}
          hits={compareResults(results2.hits, results1.hits)}
          number={2}
        />
      </div>
    </main>
  );
}

export default App;
