# coa-tcp

[![GitHub license](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
[![npm version](https://img.shields.io/npm/v/coa-tcp.svg?style=flat-square)](https://www.npmjs.org/package/coa-tcp)
[![npm downloads](https://img.shields.io/npm/dm/coa-tcp.svg?style=flat-square)](http://npm-stat.com/charts.html?package=coa-tcp)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/coajs/coa-tcp/pulls)

一个轻量的 TCP 服务框架，是 COA 核心库组成之一

可以快速创建一个 TCP 服务，支持单片机或物联网设备、跨平台 TCP 应用的连接。

## 特性

- **简单轻量** 基于 `Node.js` 内置的 [Net](https://nodejs.org/api/net.html) 模块，简单轻量，不依赖于其他第三方库
- **自动管理连接池** 自动维护管理客户端连接池，无需关心连接和释放的问题，专注于收发消息和业务逻辑的开发
- **TypeScript** 全部使用 TypeScript 书写，类型约束、IDE 友好

## 快速开始

### 安装

```shell
yarn add coa-tcp
```

### 快速开始

```typescript
import { CoaClientPool, CoaTcp } from 'coa-tcp'

// 创建一个客户端连接池
const clientPool = new CoaClientPool()

// 创建一个tcp服务
const tcpServer = new CoaTcp(clientPool, 5000)

// 启动服务
tcpServer.start()
```

当控制台输出类似提示，则说明 TCP 服务已经正常启动，可以接受客户端的连接了

```shell
[TCP] Listening on port 5000
```

### 自定义客户端

```typescript
import { Socket } from 'net'
import { CoaClient, CoaClientPool, CoaTcp } from 'coa-tcp'

// 自定义客户端
class CustomClient extends CoaClient {
  // 接收到数据
  async onData(raw: Buffer) {
    // 收到数据后要处理的事情
  }

  // 上线
  async onOnline(deviceId: string) {
    super.onOnline(deviceId)
    // 客户端上线要处理的事情
  }

  // 下线
  async onOffline(deviceId: string) {
    super.onOffline(deviceId)
    // 客户端下线要处理的事情
  }
}

// 自定义客户端连接池
class CustomClientPool extends CoaClientPool<CustomClient> {
  // 生成一个自定义的客户端
  newClient(socket: Socket) {
    return new CustomClient(socket, `custom-id-${++this.increment}`, 'CustomClient')
  }
}

// 创建一个客户端连接池
const clientPool = new CustomClientPool()

// 创建一个tcp服务
const tcpServer = new CoaTcp(clientPool, 5000)

// 启动服务
tcpServer.start()
```
