export function changePosition(homeStadium, list) {
  const indexOfHomeS = list.indexOf(homeStadium);
  list.splice(indexOfHomeS, 1, list[0]);
  list.splice(0, 1, homeStadium); // this moves the home stadium at the first..
  return list;
}
