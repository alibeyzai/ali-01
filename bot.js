const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');

const TOKEN = '8123245257:AAGeDwkBYycaETcbR94jMVHg8xUr-R9iJfc';
const DB_FILE = './db.json';

const bot = new Telegraf(TOKEN);

// بارگذاری دیتابیس یا ساخت فایل جدید
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({}));
  }
  const data = fs.readFileSync(DB_FILE);
  return JSON.parse(data);
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// افزودن یا بروز رسانی کاربر
function addUser(userId, inviterId = null) {
  const db = loadDB();
  if (!db[userId]) {
    db[userId] = { score: 0, invited: [], invitedBy: null };
    if (inviterId && inviterId !== userId) {
      if (db[inviterId]) {
        if (!db[inviterId].invited.includes(userId)) {
          db[inviterId].score++;
          db[inviterId].invited.push(userId);
          db[userId].invitedBy = inviterId;
        }
      }
    }
    saveDB(db);
  }
}

// منوی اصلی
function mainMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🔱 درباره توکن', 'about')],
    [Markup.button.callback('📊 امتیاز من', 'score')],
    [Markup.button.url('📢 کانال رسمی', 'https://t.me/hakhmen')],
    [Markup.button.callback('📨 دعوت دوستان', 'invite')],
    [Markup.button.callback('🏆 جدول برترین‌ها', 'top')],
  ]);
}
