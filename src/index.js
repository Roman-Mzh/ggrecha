import Tap from './tap';
import botProcess from './bot';

const app = () => {
  const tap = new Tap;
  const bot = botProcess(tap);
  return { tap, bot };
};


export default app;