import { TCPClient } from "pocket-sockets"
const BrowserSocket = require('browser-socket/client')

export class BrowserTCPClient extends TCPClient {
    protected socket?: any | undefined;

    protected socketConnect() {
        if (this.socket) {
            throw new Error("Socket already created.");
        }

        if (!this.clientOptions) {
            throw new Error("clientOptions is required to create socket.");
        }

        
            this.socket = BrowserSocket.createTcpSocket({
                host: this.clientOptions.host,
                port: this.clientOptions.port,
            });
            if (this.socket) {
                this.socket.on("connect", this.socketConnected);
            }
        

        if (!this.socket) {
            throw new Error("Could not create socket.");
        }
    }
}