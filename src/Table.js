import { useTable } from "react-table";

function showStatus({status, delta }) {
  if (status === "same") {
    return null;
  } else if (status === "higher") {
    return `✅+${delta}`;
  } else if (status === "lower") {
    return "🔻" + delta;
  } else {
    return "✨";
  }
}

function Cell(props) {
  const { cell } = props;

  // set array and object values to JSON string
  let value = cell.value;
  if (Array.isArray(value) || typeof value === "object") {
    try {
      value = value?.name || value.map(val => val?.name || val?.label || val).join("; ");
    } catch {
      value = JSON.stringify(value);
    }
  }

  return (
    <td {...cell.getCellProps()} title={value}>
      {value}
    </td>
  );
}

export default function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  // Render the UI for your table
  return (
    <div className="results_table">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              <th title="Difference in Rank">🔼</th>
              <th title="Number">#</th>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            if (data[i].highlight) {
              const highlight = Object.values(data[i].highlight)[0].join(" ").replaceAll(/(\\r\\n|\\n|\\r)/gm, " ");
              return (
                <>
                  <tr {...row.getRowProps()} className="highlight">
                    <td title={data[i].status}>{showStatus(data[i])}</td>
                    <td>{i + 1}</td>
                    {row.cells.map((cell) => (
                      <Cell cell={cell} />
                    ))}
                  </tr>
                  <tr
                    className="highlight"
                    colSpan="100%"
                  >
                    <td/>
                    <td/>
                    <td colSpan="100%" className="highlight" dangerouslySetInnerHTML={{ __html: highlight }}/>
                  </tr>
                </>
              );
            }
            return (
              <tr {...row.getRowProps()}>
                <td title={data[i].status}>{showStatus(data[i])}</td>
                <td>{i + 1}</td>
                {row.cells.map((cell) => <Cell cell={cell} />)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
