import moment from 'moment';
import fetch from 'node-fetch';
import jsdom from 'jsdom';

import bot from './bot';
import { Checkin, Follow } from './models';

class Tap {
  async syncAll() {
    Follow.findAll().then(follows => {
      const parses = new Set(follows.map(e => e.tapUsername));
      parses.forEach(user => {
        this.syncOne(user)
      });
    });
  }

  async checkLast(id, username) {
    const checkins = await Checkin.findAll({
      where: { tapUsername: username },
      order: [['date', 'desc']],
      limit: 1,
    });
    if(checkins.length) {
      const checkin = checkins[0];
      bot.sendMessage(id, checkin.last());
    } else {
      bot.sendMessage(id, `У ${username} нет чекинов, или на него никто не подписан :(`);
    }
  }

  async syncOne(username) {
    const beers = await parseBeers(username);
    beers.forEach(beer => {
      Checkin.findOrCreate({ where: { checkin_id: beer[0] }, defaults: beer[1] });
    })
  }

  async notifyAll() {
    const checkins = await Checkin.findAll({
      where: { isSent: false },
    });
    checkins.forEach(checkin => {
      this.notifyOne(checkin);
    });
  }

  async notifyOne(checkin) {
    const follows = await Follow.findAll({ where: { tapUsername: checkin.tapUsername } });
    if(!follows.length) return;

    const chats = follows.map(f => f.chatId);
    const tgUsername = follows[0].tgUsername;
    checkin.update({ isSent: true })
    chats.forEach((id) => {
      bot.sendMessage(id, checkin.text(tgUsername))
        .then(() => {
          bot.sendMessage(id, `https://untappd.com/user/${checkin.tapUsername}/checkin/${checkin.checkin_id}`)
        })
    })
  }
}

async function recentBeers(url) {
  const page = await fetch(url);
  const html = await page.text();
  const doc = new jsdom.JSDOM(html);
  const { window: { document } } = doc;
  return document.getElementById('main-stream');
}

async function parseBeers(username) {
  const doc = await recentBeers(`https://untappd.com/user/${username}`);
  const items = doc.querySelectorAll('.item');
  return Array.from(items).map((item) => {
    const { dataset: { checkinId } } = item;
    const text = item.querySelector('.text');
    const rating = item.querySelector('[data-rating]').dataset.rating;
    const date = item.querySelector('a[data-href=":feed/viewcheckindate"]');
    const checkinData = {
      tapUsername: username,
      fullName: text.querySelector('a:nth-child(1)').innerHTML,
      beerName: text.querySelector('a:nth-child(2)').innerHTML,
      brewery: text.querySelector('a:nth-child(3)').innerHTML,
      place: (text.querySelector('a:nth-child(4)')||{}).innerHTML,
      date: moment(date.innerHTML).format(),
      score: parseFloat(rating)*100
    };
    return [checkinId, checkinData];
  })
}

export default Tap;