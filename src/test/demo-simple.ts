import { CoaClientPool, CoaTcp } from '..'

// 创建一个客户端连接池
const clientPool = new CoaClientPool()

// 创建一个tcp服务
const tcpServer = new CoaTcp(clientPool, 5000)

// 启动服务
tcpServer.start()