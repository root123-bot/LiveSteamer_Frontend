export const noDuplicatesCtx = (ctx) => {
  let manipulatedCtx = [...ctx];
  let objeId = [];
  for (let arr of ctx) {
    let keys = Object.keys(arr);
    objeId.push(keys[0]);
  }
  const ids = [...objeId];
  for (let id of ids) {
    const occ = ids.filter((item) => item === id);
    console.log("occurence ", occ);
    if (occ.length > 1) {
      for (let i = 0; i < occ.length - 1; i++) {
        const index = ids.indexOf(occ[i]);
        ids.splice(index, 1);
        manipulatedCtx.splice(index, 1);
      }
    }
  }

  return manipulatedCtx;
};
