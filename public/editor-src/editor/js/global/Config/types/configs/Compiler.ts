interface Browser {
  type: "browser";
}

interface Server {
  type: "server";
}

export type Compiler = Browser | Server;
