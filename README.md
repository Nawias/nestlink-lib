# NestLink - Debugging library for LÖVE Potion

`NestLink` is a lightweight debugging library for managing TCP connections, sending Lua commands, and handling real-time communication with LÖVE Potion for debugging purposes. It provides an easy-to-use interface for connecting to a TCP socket, sending and receiving data, and interacting with the console.

## Features

- **TCP Connection Management**: Easily establish and manage TCP connections with the debug target.
- **Real-time Data Handling**: Subscribe to events and handle incoming data in real-time.
- **Lua Code Execution**: Send Lua code to the debug target and print global variables.
- **Global Variable Inspection**: Query and print global variables from a Lua environment.

## Installation

To install `nestlink`, simply add it as a dependency to your project using npm or yarn:

```bash
npm install nestlink
```

or

```bash
yarn add nestlink
```

## Usage

### Create a Connection

First, instantiate a `Connection` object with the required configuration:

```typescript
import { Connection } from 'nestlink';

const config = {
  host: 'localhost',
  port: 12345
};

const connection = new Connection(config);
```

### Connecting to the debug target

To establish a TCP connection, use the `connect` method:

```typescript
connection.connect();
```

### Listening for Data

You can subscribe to data events using the `onData` method. Incoming data is parsed as a string:

```typescript
connection.onData((data: string) => {
  console.log('Received data:', data);
});
```

### Sending Data

Send arbitrary commands to the debug target with the `send` method:

```typescript
connection.send('some command');
```

### Running Lua Code

You can send Lua code to be executed on the debug target with the `runLua` method:

```typescript
connection.runLua('print("Hello from Lua!")');
```

### Printing Global Variables

To print the value of a global variable, use the `printVariable` method:

```typescript
connection.printVariable('myGlobalVar');
```

To get all global variables from the debug target:

```typescript
connection.getGlobals();
```


### Closing the Connection

To disconnect from the debug target, use the `disconnect` method:

```typescript
connection.disconnect();
```

## API Documentation

### `Connection`

#### `new Connection(config: ConnectionConfig)`

Creates a new connection instance with the provided configuration.

**Parameters:**
- `config`: Configuration object with the following properties:
  - `host`: the debug target host (string).
  - `port`: the debug target port (number).

#### `connect()`

Establishes a TCP connection to the debug target.

#### `disconnect()`

Closes the connection to the debug target.

#### `onData(fn: (data: string) => void)`

Subscribes to incoming data events. The `fn` callback is triggered every time data is received.

**Parameters:**
- `fn`: A callback function that receives the incoming data as a string.

#### `send(text: string)`

Sends an arbitrary command or text to the debug target.

**Parameters:**
- `text`: The text or command to send.

#### `runLua(code: string)`

Runs the provided Lua code on the debug target.

**Parameters:**
- `code`: The Lua code to execute.

#### `printVariable(variable: string)`

Asks the debug target to send the value of a named global variable.

**Parameters:**
- `variable`: The name of the global variable to print.

#### `getGlobals()`

Asks the debug target to send over the global variable table and stores it for later access in the `globals` property.

#### `globals`

Getter for the global table.


## Example

```typescript
import { Connection } from 'nestlink';

const connection = new Connection({
  host: 'localhost',
  port: 12345,
});

connection.onConnect(() => {
  console.log('Connected to server!');
  connection.getGlobals();
});

connection.onData((data) => {
  console.log('Received data:', data);
});


connection.connect();
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

