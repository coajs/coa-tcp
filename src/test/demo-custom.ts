import { Socket } from 'net'
import { CoaClient, CoaClientPool, CoaTcp } from '..'

// 自定义客户端
class CustomClient extends CoaClient {

  // 接收到数据
  async onData (raw: Buffer) {
    // 收到数据后要处理的事情
  }

  // 上线
  async onOnline (deviceId: string) {
    super.onOnline(deviceId)
    // 客户端上线要处理的事情
  }

  // 下线
  async onOffline (deviceId: string) {
    super.onOffline(deviceId)
    // 客户端下线要处理的事情
  }
}

// 自定义客户端连接池
class CustomClientPool extends CoaClientPool<CustomClient>{

  // 生成一个自定义的客户端
  newClient (socket: Socket) {
    return new CustomClient(socket, `custom-id-${++this.increment}`, 'CustomClient')
  }
}

// 创建一个客户端连接池
const clientPool = new CustomClientPool()

// 创建一个tcp服务
const tcpServer = new CoaTcp(clientPool, 5000)

// 启动服务
tcpServer.start()