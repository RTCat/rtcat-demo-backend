# 实时猫DEMO Backend

用于实时猫Web Demo和Android 1v1 Demo的后端项目, 提供创建Session, 获取Session下token的功能

## 先决条件

本项目依赖nodejs, 开始前请在电脑上安装最新版[nodejs](https://nodejs.org/en/download/),并将npm升级至最新版(作者电脑上是3.5.0),

在本机安装[python2.7](https://www.python.org/download/releases/2.7/)
 
另外, Windows操作系统如果遇到node gyp的问题, 请前往其[项目主页](https://github.com/nodejs/node-gyp)按要求安装依赖.

## 快速开始

1. 克隆本项目

2. 运行`npm install`命令安装项目依赖

3. 复制目录下的`config.sample.json`文件重命名为`config.json`，并填入自己的 apikey,apisecret

4. 运行`npm start`命令, 运行本项目, 本项目的默认端口为8080, 如果需要运行在另外的端口, 可以通过
`PORT=8000 npm start`的方式来调整端口

5. 通过浏览器访问 http://localhost:8080/sessions , 你应该可以看到一个包含session信息的JSON数据, 形如:
```JSON
{
    "uuid": "740a243d-c929-47a7-92f6-10d12bf9c425",
    "label": "demo",
    "type": "p2p",
    "permanent": false,
    "data": null,
    "time_created": "2016-03-04T05:21:53.445828Z",
    "live_days": 30,
    "expire_in": "2016-04-03T05:21:53.445Z"
}
```
阅读下面章节了解更多有关接口的信息.

## 接口说明

本项目提供以下接口

```
GET /sessions  
 
创建一个session, 返回新创建的session信息, 形如
{
    "uuid": "740a243d-c929-47a7-92f6-10d12bf9c425",
    "label": "demo",
    "type": "p2p",
    "permanent": false,
    "data": null,
    "time_created": "2016-03-04T05:21:53.445828Z",
    "live_days": 30,
    "expire_in": "2016-04-03T05:21:53.445Z"
}
其中uuid即为session id.
```

```
GET /:sessionId/tokens

将sessionId替换为获取的session id, 在该session id创建一个token, 返回新创建的token信息, 形如
{
    "uuid": "65535df7-8e39-48f4-8d78-6413e348e9f1",
    "session_id": "740a243d-c929-47a7-92f6-10d12bf9c425",
    "label": null,
    "type": "pub",
    "permanent": false,
    "data": null,
    "time_created": "2016-03-04T05:43:21.407865Z",
    "live_days": 15,
    "expire_in": "2016-03-19T05:43:21.407Z"
}
其中uuid即为token
```

```
GET /tokens/:sessionName

将sessionName替换为任意名称, 如果不存在该名称的session则新建一个该名称的session,并在该session下创建一个token,
如果存在该名称的session , 则直接在该session下创建一个token, 返回新创建的token信息, 形如:
{
    "uuid": "65535df7-8e39-48f4-8d78-6413e348e9f1",
    "session_id": "740a243d-c929-47a7-92f6-10d12bf9c425",
    "label": null,
    "type": "pub",
    "permanent": false,
    "data": null,
    "time_created": "2016-03-04T05:43:21.407865Z",
    "live_days": 15,
    "expire_in": "2016-03-19T05:43:21.407Z"
}
其中uuid即为token, 推荐直接使用此接口
```


