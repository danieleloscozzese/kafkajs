import request0 from "./firstMessage/request.mjs";
import response0 from "./firstMessage/response.mjs";
import request1 from "./finalMessage/request.mjs";
import response1 from "./finalMessage/response.mjs";

const indexProtocol = {
  firstMessage: {
    request: request0,
    response: response0,
  },
  finalMessage: {
    request: request1,
    response: response1,
  },
};

export default indexProtocol;
