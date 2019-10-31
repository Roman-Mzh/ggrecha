import Tap from './tap';

const tap = new Tap;
setTimeout(() => {
  tap.syncAll();
}, 120000);
tap.notifyAll();