[![status](https://img.shields.io/github/workflow/status/CSPDevTeam/CSPGuildBot/Package%20Nodejs%20Plugin?style=for-the-badge)](https://github.com/CSPDevTeam/CSPGuildBot/actions)
[
![Latest Tag](https://img.shields.io/github/v/tag/CSPDevTeam/CSPGuildBot?label=LATEST%20TAG&style=for-the-badge)
![GitHub Releases (by Asset)](https://img.shields.io/github/downloads/CSPDevTeam/CSPGuildBot/latest/total?style=for-the-badge)
](https://github.com/CSPDevTeam/CSPGuildBot/releases/latest)

# CSPGuildBot - The Simple Channel Bot
![CSPGuildBot](https://socialify.git.ci/CSPDevTeam/CSPGuildBot/image?description=1&forks=1&issues=1&logo=https%3A%2F%2Fgithub.com%2FCSPDevTeam%2FCSPGuildBot%2Fraw%2Fmaster%2Fres%2FMain.png&owner=1&pulls=1&stargazers=1&theme=Light)
👉English👈 👉 [简体中文](README-zh.md)👈

## ❓ Why do the project
> There are a lot of bot software on the market, but they all need external support and cumbersome configuration makes it hard to use, this product is to solve this problem.

## 💻 Installation
1. Go to [Release page](https://github.com/CSPDevTeam/CSPGuildBot/releases) to download the latest version
2. Install [LiteLoader](https://github.com/CSPDevTeam/CSPGuildBotBDS/)
3. Put the downloaded stuff into the plugins folder
4. Configure the config file according to the comments
5. Start BDS

## 📝 Instructions for use
1. Type `gbot help` in BDS to view help
2. Configure account and password
``` yaml
account:
  id: 123456789 #QQ number
  password: "114514" #password (can be plaintext or MD5)
```
3. configure `guild_id`
``` yaml
guild_id:
	- guild_id: "1145141919810" #channel_id(can use `gbot guild to` check)
	  channel_id: "114514" #subchannel id (you can use `gbot channel <guildid>` to see it)
	  type: "console" #You can specify here as console(console) or chat(chat) (more new features will be added later)
```
4. configure `adminId` (you can use gbot member \<guildid> to query)` (probability of query failure)`

## 🔈 Custom events
- Find `CustomEvent` in the config
- Find the listener you want in [LiteLoader Script Docs](https://docs.litebds.com/#/zh_CN/Development/EventAPI/Listen)
``` yaml
#Write it like this
onJoin: #Listener name
  callback: "Player {1.name} entered the server" # Message you want to send (placeholders can be used) (1 is the first argument, "." followed by the index of the parameter)
  type: "chat" #The type of channel to be sent
```

## 🎯 Built-in commands
- `run <command>` Send the command in the console's channel to run
- `say <content>` Send in the chat channel to send a message to the server.
- Stay tuned...

## 🏆 Thanks
- Thanks to [HuoHuas001](https://github.com/HuoHuas001) for the development
- Thanks to [yanhy2000](https://github.com/yanhy2000) for the idea support
- Thanks to [LiteLDev](https://github.com/LiteLDev) for the support