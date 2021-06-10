import { echo } from 'coa-echo'
import { _ } from 'coa-helper'
import { createServer, Server, Socket } from 'net'
import { CoaClient } from './CoaClient'
import { CoaClientPool } from './CoaClientPool'

export class CoaApplication<T extends CoaClient> {
  private readonly listenPort: number
  private readonly clientPool: CoaClientPool<T>
  private readonly tcpServer: Server

  constructor(clientPool: CoaClientPool<T>, listenPort: number) {
    this.clientPool = clientPool
    this.listenPort = listenPort
    this.tcpServer = createServer((socket) => this.connectionListener(socket))
  }

  // 监听
  start() {
    this.tcpServer.listen(this.listenPort, () => {
      echo.cyan('[TCP] Listening on port ' + this.listenPort)
    })
  }

  // 监听连接事件
  private connectionListener(socket: Socket) {
    let client: T
    // 只有首次收到数据，才开始初始化一个客户端
    socket.on('data', async (raw) => {
      if (!client) client = await this.clientPool.connect(socket)
      await client.onData(raw)
    })
    // 关闭连接的时候销毁数据
    socket.on('close', async () => {
      if (client) await this.clientPool.close(client)
    })
    socket.on('error', _.noop)
    // 如果超过30秒没有任何响应，则断开连接
    socket.on('timeout', () => socket.end(() => socket.destroy()))
    socket.setTimeout(30 * 1000)
  }
}
