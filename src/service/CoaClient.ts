import { echo } from 'coa-echo'
import { _ } from 'coa-helper'
import { Socket } from 'net'

export class CoaClient {
  socket: Socket
  clientId: string
  deviceId: string
  type: string
  isOnline: boolean
  isWorking: boolean
  live: number

  constructor(socket: Socket, clientId: string, type: string) {
    this.socket = socket
    this.type = type
    this.clientId = clientId
    this.deviceId = ''
    this.isOnline = false
    this.isWorking = false
    this.live = 0
  }

  // 连接
  async onConnect() {}

  // 连接关闭
  async onClose() {}

  // 设备上线
  async onOnline(deviceId: string) {}

  // 设备下线
  async onOffline(deviceId: string) {}

  // 接收到数据
  async onData(raw: Buffer) {}

  // 设置设备状态
  async setDevice({ deviceId }: { deviceId: string }) {
    // 记录上次的设备ID
    const lastDeviceId = this.deviceId + ''

    this.deviceId = deviceId
    this.isOnline = !!deviceId
    this.live = _.now()

    // 判断设备ID是否改变，触发上线下线操作
    if (deviceId !== lastDeviceId) {
      if (this.isOnline) {
        await this.onOnline(deviceId)
        echo.log('%s已上线: %s %s', this.type, deviceId, this.clientId)
      } else {
        await this.onOffline(lastDeviceId)
        echo.log('%s已下线: %s %s', this.type, lastDeviceId, this.clientId)
      }
    }
    return this.live
  }
}
