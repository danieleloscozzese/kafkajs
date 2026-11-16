const CONNECTION_STATUS = {
  CONNECTED: "connected",
  DISCONNECTING: "disconnecting",
  DISCONNECTED: "disconnected",
};

const CONNECTED_STATUS = [CONNECTION_STATUS.CONNECTED, CONNECTION_STATUS.DISCONNECTING];

const connectionStatus = {
  CONNECTION_STATUS,
  CONNECTED_STATUS,
};

export default connectionStatus;
