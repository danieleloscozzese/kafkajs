import { preloadProtocol } from "./preload_protocol_modules.mjs";
// Complete the native registry before Cluster links the CommonJS SASL controller.
import "../src/protocol/requests/index.mjs";

await preloadProtocol("src/protocol/requests/**/v*/@(request|response).mjs");
