// setup-after-env.js
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
// tslint:disable-next-line: variable-name
const _beforeEach = global.beforeEach;
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
global.beforeEach = fn => {
  _beforeEach(async () => {
    try {
      await fn();
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(e);
      throw e;
    }
  });
};
