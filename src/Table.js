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
            return (
              <tr {...row.getRowProps()}>
                <td title={data[i].status}>{showStatus(data[i])}</td>
                <td>{i + 1}</td>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} title={cell.value}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
