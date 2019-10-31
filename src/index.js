import Tap from './tap';

const tap = new Tap;
setInterval(() => {
  tap.syncAll();
  tap.notifyAll();
}, 120000);