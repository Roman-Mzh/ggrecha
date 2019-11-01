import Tap from './tap';
import botProcess from './bot';

const app = () => {
  const tap = new Tap;
  const bot = botProcess(tap);
  tap.start(bot);
  return { tap, bot };
};


export default app;