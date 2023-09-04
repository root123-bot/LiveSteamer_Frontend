// for all information on why my .sort() function below accept function as parameter https://www.w3schools.com/js/js_array_sort.asp

export const sortCtxByCreatedAt = (ctx) => {
  const createdAt = [];
  let newCreatedAt = [];
  const newCtx = [];

  for (let match of ctx) {
    console.log(match[Object.keys(match)[0]].createdAt);
    createdAt.push(match[Object.keys(match)[0]].createdAt);
    const createdCopy = [...createdAt];
    newCreatedAt = createdCopy.sort(function (a, b) {
      return b - a;
    });
  }

  for (let time of newCreatedAt) {
    const index = newCreatedAt.indexOf(time);
    const objIndexInCtx = createdAt.indexOf(time);
    newCtx[index] = ctx[objIndexInCtx];
  }

  return newCtx;
};
