[![status](https://img.shields.io/github/workflow/status/CSPDevTeam/CSPGuildBot/Package%20Nodejs%20Plugin?style=for-the-badge)](https://github.com/CSPDevTeam/CSPGuildBot/actions)
[
![Latest Tag](https://img.shields.io/github/v/tag/CSPDevTeam/CSPGuildBot?label=LATEST%20TAG&style=for-the-badge)
![GitHub Releases (by Asset)](https://img.shields.io/github/downloads/CSPDevTeam/CSPGuildBot/latest/total?style=for-the-badge)
](https://github.com/CSPDevTeam/CSPGuildBot/releases/latest)
# CSPGuildBot - 简洁的频道机器人
![CSPGuildBot](https://socialify.git.ci/CSPDevTeam/CSPGuildBot/image?description=1&forks=1&issues=1&logo=https%3A%2F%2Fgithub.com%2FCSPDevTeam%2FCSPGuildBot%2Fraw%2Fmaster%2Fres%2FMain.png&owner=1&pulls=1&stargazers=1&theme=Light)
👉[English](README.md)👈 👉简体中文👈

## ❓为什么要做该项目
> 市面上有很多的机器人软件，但是都需要外部的支持，繁琐的配置导致很难用，本产品就是为了解决这个问题。

## 💻安装
1. 前往[Release页面](https://github.com/CSPDevTeam/CSPGuildBot/releases)下载最新的版本
2. 安装好[LiteLoader](https://github.com/LiteLDev/LiteLoaderBDS/)
3. 将下载的东西放进plugins文件夹中
4. 按注释配置好config文件
5. 启动BDS

## 📝使用说明
1. 在BDS中输入`gbot help`查看帮助
2. 配置账号和密码
``` yaml
account:
  id: 123456789 #QQ号
  password: "114514" #密码(可为明文或MD5)(若不填则启动扫码登陆 推荐)
```
3. 配置`guild_id`
``` yaml
guild_id:
	- guild_id: "1145141919810" #频道id(可以使用gbot guild查看)
	  channel_id: "114514" #子频道id(可以使用gbot channel <guildid>查看)
	  type: "console" #这里可以指定为console(控制台)或者chat(聊天) (后续会增加更多新功能)
```
4. 配置`adminId` (可以使用gbot member \<guildid>来查询)`(概率查询失败)`
5. 若遇到`滑动验证码`输入ticket请使用`gbot ticket "<ticket>"`来输入ticket

## 🔈自定义事件
- 在config中找到`CustomEvent`
- 在[LiteLoader Script Docs](https://docs.litebds.com/#/zh_CN/Development/EventAPI/Listen)中找到你想要的监听器
``` yaml
#按照这个样子写
onJoin: #监听器名称
  callback: "玩家{1.name}进入服务器" #想要发送的消息（可使用占位符）(1代表第一个参数，"."后面的代表参数的索引)
  type: "chat" #需要发送的频道类型
```

## 🎯内置命令
- `run <command>` 在console的频道内发送即可运行指令
- `say <content>` 在chat的频道内发送即可发送消息到服务器重
- `query @somebody` 在频道内发送即可查询@somebody的信息
- `queryme` 在频道内发送即可查询自己的信息
- 敬请期待...

## 🏆感谢
- 感谢[HuoHuas001](https://github.com/HuoHuas001)的开发
- 感谢[yanhy2000](https://github.com/yanhy2000)的想法支持
- 感谢[LiteLDev](https://github.com/LiteLDev)的支持
