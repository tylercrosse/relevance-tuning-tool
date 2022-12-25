export function search(searchEndpoint, index, query, queryDSL) {
  return fetch("http://localhost:3000/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      searchEndpoint,
      index,
      query: JSON.parse(queryDSL.replace(/%searchQuery%/g, query)),
    }),
  }).then((response) => response.json());
}
