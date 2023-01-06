import React, { Suspense } from "react";
import useLocalStorage from "./utils/useLocalStorage";
import Table from "./Table";
import ColumnSelector from "./ColumnSelector";
import AceEditor from "react-ace";

function RawResults(props) {
  return (
    <div className="raw_results">
      <AceEditor
        placeholder="Placeholder Text"
        width="100%"
        height="calc(100vh - 200px)"
        mode="json"
        theme="textmate"
        name="results"
        readOnly
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={JSON.stringify({ ...props.raw, hits: props.hits }, null, 2)}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}

/**
 * Responsible for rendering the results of a query
 */
export default React.memo(function Results(props) {
  const [selectedColumns, setSelectedColumns] = useLocalStorage(
    `selectedColumns${props.number}`,
    []
  );
  const [areHighlightsOn, setAreHighlightsOn] = useLocalStorage(
    'areHighlightsOn',
    false
  );
  const columns = selectedColumns.map((col) => ({
    Header: col.label,
    accessor: col.value, // accessor is the "key" in the data
  }));
  columns.push({
    Header: "Id",
    accessor: "_id",
  });
  return (
    <section className="results">
      <header className="results_header">
        <h2>{props.raw?.total?.value} Results</h2>
        <label>
          <input
            type="checkbox"
            checked={areHighlightsOn}
            onChange={(e) => setAreHighlightsOn(e.target.checked)}
          />
          Show Highlights
        </label>
      </header>
      <Suspense fallback={<div>Loading...</div>}>
        <ColumnSelector
          hits={props.hits || []}
          selectedColumns={selectedColumns}
          setSelectedColumns={setSelectedColumns}
        />
        <Table
          columns={columns}
          data={props.hits || []}
          areHighlightsOn={areHighlightsOn}
        />
      </Suspense>
      <h3>Raw Results</h3>
      <Suspense fallback={<div>Loading...</div>}>
        <RawResults raw={props.raw} hits={props.hits} />
      </Suspense>
    </section>
  );
});
