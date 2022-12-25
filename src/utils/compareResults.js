// Compare the two lists of results to see the relative position of documents in each list. If a document is in both lists, indicate when a document is higher, lower or stayed the same.
export default function compareResults(theseResults, otherResults) {
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
      delta,
    };
  });
}
