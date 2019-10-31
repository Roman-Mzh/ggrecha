import fetch from 'node-fetch';
import Agent from 'socks5-https-client/lib/Agent';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

import { Follow } from './models';
import { tap } from './index';

dotenv.config();

const bot = new TelegramBot(process.env.TG_TOKEN, {
  polling: true,
  request: {
      agentClass: Agent,
      agentOptions: {
        socksHost: process.env.SOCKS_HOST,
        socksPort: process.env.SOCKS_PORT,
        socksUsername: process.env.SOCKS_USER,
        socksPassword: process.env.SOCKS_PASS
      }
  }
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `
  commands:
<pre>/follow untappdUsername [telegramUsername]</pre> follow untappd user. If telegramUsername is specified, will tag this username on checkin!

<pre>/following</pre> display a list of following untappd users for this channel

<pre>/unfollow untappdUsername</pre> stop following user

<pre>/last untappdUsername</pre> show last checked beer of user
  `, { parse_mode: 'HTML' });
})

bot.onText(/\/follow (.*)/, ({ chat: { id } }, match) => {
  const text = match[1].split(' ');
  follow(id, text);
})

bot.onText(/\/last (.*)/, ({ chat: { id } }, match) => {
  const username = match[1];
  tap.checkLast(id, username);
})

bot.onText(/\/following/, ({ chat: { id } }) => {
  Follow.findAll({ where: { chatId: id } })
    .then(followings => {
      const list = followings.length ? followings.map(e => `${e.tapUsername} (${e.tgUsername || '-'})`).join(', ') :
      'кажется, подписок нет. возможно, нужно подписаться на zhigulevskoe?';
      bot.sendMessage(id, list);
    })
})

bot.onText(/\/unfollow (.*)/, ({ chat: { id } }, match) => {
  Follow.destroy({
    where: { chatId: id, tapUsername: match[1] }
  }).then(res => {
    if(!res) {
      bot.sendMessage(id, `кажется, я не подписан на ${match[1]}`);
    } else {
      bot.sendMessage(id, `${match[1]} нам больше не интересен. жаль.`);
    }
  })
})

const follow = async (id, [tapUsername, tg]) => {
  try {
    const url = `https://untappd.com/user/${tapUsername}`;
    const res = await fetch(url);
    if (res.status === 404) throw `Вот это поворот! В тапке нет юзера ${tapUsername}`;
    const followObj = {
      chatId: id,
      tapUsername: tapUsername
    }
    const f = await Follow.findAll({ where: followObj });
    if (!!f.length) throw `я уже подписан на комрада ${tapUsername} в этом чати`;
    Follow.create({ ...followObj, tgUsername: tg });
    tap.syncOne(tapUsername)
    bot.sendMessage(id, `отлично! ждём, пока ${tapUsername} зачекинит пиво!`);
  } catch (e) {
    bot.sendMessage(id, e);
  }
}

// bot.sendMessage(-238934789, 'я же не яндех -.-')

bot.on('message', (msg) => {
  console.log(msg)
})

export default bot;