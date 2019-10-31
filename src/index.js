import Tap from './tap';
import debug from 'debug';


const tap = new Tap;
const appLog = debug('app');
appLog('lets start!');

setInterval(() => {
  appLog('lets sync!');
  tap.syncAll();
  appLog('lets notify!');
  tap.notifyAll();
}, 120000);

export { tap, appLog };