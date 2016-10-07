export const generateIconIndexes = (size, totPair) => {
  if (size % 2 !== 0) {
    throw new Error('Board size should be even');
  }

  const indexes = [];

  // Pick n pairs of cat
  let cnt = 0;
  let nPair = size * size / 2;
  while (nPair --) {
    indexes[cnt] = parseInt(Math.random() * totPair, 10);
    indexes[cnt + 1] = indexes[cnt];
    cnt += 2;
  }

  // Shuffle indexes
  while (cnt --) {
    const i = parseInt(Math.random() * cnt, 10);
    [indexes[i], indexes[cnt]] = [indexes[cnt], indexes[i]];
  }

  return indexes;
};

export const setInputs = (inputs, options) => {
  inputs.each((i, e) => {
    Object.assign(e, options)
  });
};

export const getInputs = ($container, state = null) => {
  return state ? $container.find(`input:${state}`) : $container.find('input');
};
