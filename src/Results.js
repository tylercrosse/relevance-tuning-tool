import useLocalStorage from "./useLocalStorage";
import Table from "./Table";
import ColumnSelector from "./ColumnSelector";
import AceEditor from "react-ace";

/**
 * Responsible for rendering the results of a query
 */
export default function Results(props) {
  const [selectedColumns, setSelectedColumns] = useLocalStorage(
    `selectedColumns${props.number}`,
    []
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
      </header>
      <ColumnSelector
        hits={props.hits || []}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
      />
      <Table columns={columns} data={props.hits || []} />
      <h3>Raw Results</h3>
      <AceEditor
        placeholder="Placeholder Text"
        width="100%"
        maxLines={Infinity}
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
    </section>
  );
}
