import Select from "react-select";
import camel2Title from "./utils/camel2Title";

export default function ColumnSelector(props) {
  const { hits, selectedColumns, setSelectedColumns } = props;

  const options = Object.keys(hits[0]?._source || {}).map((column) => {
    return {
      value: `_source.${column}`,
      label: camel2Title(column),
    };
  });
  console.log({ hits, options, selectedColumns });

  const handleChange = (selectedOptions) => {
    setSelectedColumns(selectedOptions.map((option) => option));
  };

  return (
    <div className="column_selector">
      <Select
        isMulti
        name="columns"
        options={options}
        className="basic-multi-select"
        classNamePrefix="select"
        value={options.filter((option) =>
          selectedColumns.map((col) => col.value).includes(option.value)
        )}
        onChange={handleChange}
      />
    </div>
  );
}
