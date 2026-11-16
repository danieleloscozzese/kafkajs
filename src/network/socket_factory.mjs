import net from "node:net";
import tls from "node:tls";
const KEEP_ALIVE_DELAY = 60000; // in ms

/**
 * @returns {import("../../types").ISocketFactory}
 */
const createSocketFactory = () => {
  return ({ host, port, ssl, onConnect }) => {
    const socket = ssl
      ? tls.connect(
          Object.assign({ host, port }, !net.isIP(host) ? { servername: host } : {}, ssl),
          onConnect,
        )
      : net.connect({ host, port }, onConnect);

    socket.setKeepAlive(true, KEEP_ALIVE_DELAY);

    return socket;
  };
};

export default createSocketFactory;
