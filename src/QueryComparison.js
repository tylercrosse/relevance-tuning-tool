import React, { useEffect } from "react";
import AceEditor from "react-ace";
import CreatableSelect from "react-select/creatable";
import Results from "./Results";
import camel2Title from "./utils/camel2Title";
import toCamel from "./utils/toCamel";
import usePrevious from "./utils/usePrevious";
import { getLocalStorage } from "./utils/useLocalStorage";

import ace from "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-textmate";
import jsonWorkerUrl from "ace-builds/src-noconflict/worker-json?url";

ace.config.setModuleUrl("ace/mode/json_worker", jsonWorkerUrl);

export default function QueryComparison(props) {
  const queryDSL = getLocalStorage(props.selectedOption?.value);
  const prevQueryDSL = usePrevious(queryDSL);

  const createOption = (value) => ({
    label: camel2Title(value),
    value,
  });

  const handleCreate = (inputValue) => {
    props.setOption(createOption(toCamel(inputValue)));
    props.setQueryNames([...props.queryNames, toCamel(inputValue)]);
  };

  const handleChange = (newValue) => {
    props.setOption(newValue);
  };

  useEffect(() => {
    if (props.selectedOption?.value) {
      // If the option was updated and the has a saved query, load it to react state
      props.setQueryDSL(
        queryDSL || prevQueryDSL || '{\n  "query": {\n    \n  }\n}'
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedOption?.value]);

  const options = props.queryNames.map((name) => createOption(name));

  return (
    <article className="query">
      <section>
        <h2>Query {props.number}</h2>
        <div className="query_selector">
          <CreatableSelect
            placeholder="Saved Queries"
            mame={`querySelector${props.number}`}
            onChange={handleChange}
            onCreateOption={handleCreate}
            options={options}
            value={props.selectedOption}
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
        </div>
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
          value={queryDSL || prevQueryDSL || '{\n  "query": {\n    \n  }\n}'}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
        <p>
          Use <strong>%searchQuery%</strong> to refer to the text in the search
          bar.
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
