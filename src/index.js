import Tap from './tap';

const tap = new Tap;

setInterval(() => {
  // tap.syncAll();
  // tap.notifyAll();
}, 120000);

export default tap;