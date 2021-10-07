import { echo } from 'coa-echo'
import { _ } from 'coa-helper'
import { Socket } from 'net'
import { CoaClient } from './CoaClient'

export class CoaClientPool<T extends CoaClient> {
  protected className: string
  protected clients: { [id: string]: T } = {}
  protected increment = 10001

  constructor(className = 'CoaClient') {
    this.className = className
  }

  // 生成新的客户端
  newClient(socket: Socket): T {
    return new CoaClient(socket, `client-${++this.increment}`, this.className) as T
  }

  // 连接
  async connect(socket: Socket) {
    const client = this.newClient(socket)
    this.clients[client.clientId] = client
    await client.onConnect()
    echo.log('%s已连接: %s', this.className, client.clientId)
    return client
  }

  // 关闭连接
  async close(client: T) {
    await client.setDevice({ deviceId: '' })
    await client.onClose()
    echo.log('%s断开连接: ', this.className, client.clientId)
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.clients[client.clientId]
  }

  // 通过clintId获得Client对象
  getByClientId(clientId: string) {
    return this.clients[clientId] || undefined
  }

  // 通过deviceId获得Client对象
  getByDeviceId(deviceId: string) {
    return _.find(this.clients, (v) => v.deviceId === deviceId)
  }

  // 获取Client列表
  getList() {
    return _.map(this.clients, (v) => {
      const deviceId = v.deviceId
      const clientId = v.clientId
      const process = v.isWorking ? 'working' : v.isOnline ? 'online' : 'offline'
      return { deviceId, clientId, process }
    })
  }
}
