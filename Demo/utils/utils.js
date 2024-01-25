export function Do(itr, callback) {
  for (let i = 0; i < itr; i++) {
    callback();
  }
}

export function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
