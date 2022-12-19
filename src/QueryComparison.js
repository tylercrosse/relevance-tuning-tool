import AceEditor from "react-ace";
import Results from "./Results";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/ext-language_tools";

export default function QueryComparison(props) {
  return (
    <article className="query">
      <section>
        <h2>Query {props.number}</h2>
        <AceEditor
          placeholder="Placeholder Text"
          width="100%"
          height="320px"
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
          }} />
        <p>
          Use <strong>%searchQuery%</strong> to refer to the text in the search bar.
        </p>
      </section>
      {props.hits ? (
        <Results number={props.number} raw={props.raw} hits={props.hits} />
      ) : (
        <div className="results_empty">
          Please submit a Search to see results
        </div>
      )}
    </article>
  );
}
