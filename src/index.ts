import {parse} from '@kilcekru/lua-table'
import { BrowserTCPClient } from './BrowserTCPClient';

type ConnectionConfig = {host: string, port:number}

class Signal<DataType> {
  private _handlers: Array<(data: DataType) => void> = [];
  public subscribe(handler: (data: DataType) => void) {
    this._handlers.push(handler);
  }
  public unsubscribe(handler: (data: DataType) => void) {
    this._handlers.filter((h) => h !== handler);
  }
  public emit(data: DataType) {
    this._handlers.forEach((h) => {
      h(data);
    });
  }
}

export class Connection {
  private _client: BrowserTCPClient;
  private _globals: any | "REFRESHING";
  get globals(): any {
    return this._globals;
  }
  private _onGlobals : Signal<string>

  constructor(config: ConnectionConfig) {
    this._client = new BrowserTCPClient({
      port: config.port,
      host: config.host,
      textMode: true,
    });
    this._onGlobals = new Signal<string>()
  }

  onConnect(fn: () => void) {
    this._client.onConnect(fn);
  }

  /**
   * User hook for incoming data. Binary data is converted to string.
   * @param fn on data callback. Function is passed a string.
   */
  onData(fn: (data:string) => void) {
    this._client.onData((data:string|Buffer) =>{
      if(typeof data !== 'string'){
        data = data.toString()
      }
      if(data.startsWith("_G")){
        this._onGlobals.emit(data)
      }
      fn(data);
    });
  }
  /**
   * User hook for close event
   * @param fn Callback for connection close processing
   */
  onClose(fn: () => void) {
    this._client.onClose(fn);
  }
  /**
   * Connect to the configured TCP Socket
   */
  connect() {
    this._client.connect();
  }
  /**
   * Send an arbitrary command
   * @param text command to send to the socket
   */
  send(text: string) {
    if (!this._client.isClosed()) this._client.send(text);
  }
  /**
   * Run some Lua code on the console
   * @param code Lua code to run
   */
  runLua(code: string) {
    this.send(`run ${code}`);
  }
  /**
   * Print a global variable to console
   * @param variable name of the global variable to print
   */
  printVariable(variable: string) {
    this.send(`print ${variable}`);
  }
  /**
   * Send a command to print all global variables
   */
  getGlobals() {
    this.send("globals");
    this._globals = "REFRESHING"
    const callback = (data: string) => {
      this._globals = parse(data)
      this._onGlobals.unsubscribe(callback)
    }
    this._onGlobals.subscribe(callback)
  }
  /**
   * Close connection to the console
   */
  disconnect() {
    this._client.close();
  }
}
