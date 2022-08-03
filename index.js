const { createClient } = require("oicq");
const { GuildApp } = require("oicq-guild");
const fs = require('fs')

var config = {};

//读取Config文件
try {
  config = JSON.parse(fs.readFileSync('config.json', 'utf8'))
  console.log(config)
} catch (err) {
  console.error(err)
}

// input with your account and password
var account = config.account.id;
var password = config.account.password;

// create oicq client
const client = createClient(account);
client.login(password);

// create guild app and bind it to an oicq client
const app = GuildApp.bind(client);

app.on("ready", function () {
  console.log("My guild list:");
  console.log(this.guilds);
})

/*
GuildMessage {
  guild_id: '72124111650617189',
  channel_id: '8599870',
  guild_name: 'eoe机器人测试频道',
  channel_name: '服务器交互区',
  sender: { tiny_id: '144115218773667666', nickname: 'TPCP Robot' },
  seq: 3,
  rand: 570974309,
  time: 1659488291,
  message: [ { type: 'text', text: 'Hello, 最美夕阳红!' } ],
  raw_message: 'Hello, 最美夕阳红!',
  reply: [Function: bound sendMessage] AsyncFunction
}
*/
app.on("message", e => {
  console.log(e)
  if (e.raw_message === "hello"){
    e.reply(`Hello, ${e.sender.nickname}!`)
  }
})