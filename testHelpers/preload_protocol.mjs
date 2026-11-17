import { preloadProtocol } from "./preload_protocol_modules.mjs";

await preloadProtocol("src/protocol/requests/**/v*/@(request|response).mjs");
