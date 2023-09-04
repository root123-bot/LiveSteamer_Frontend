export default function (prevState, array2) {
  let noDuplicates = [];
  for (let start of array2) {
    if (prevState.includes(parseInt(start))) {
      continue;
    }
    noDuplicates.push(parseInt(start));
  }
  return noDuplicates;
}
