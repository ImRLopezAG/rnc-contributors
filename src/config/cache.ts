import NodeCahe from 'node-cache';

export const cache = new NodeCahe({
  stdTTL: 60 * 60,
  checkperiod: 120,
  deleteOnExpire: true,
});
