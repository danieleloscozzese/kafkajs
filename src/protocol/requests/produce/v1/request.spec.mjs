import { describe, test, expect } from "@jest/globals";
import RequestProtocol from "./request.mjs";
import RequestV0Protocol from "../v0/request.mjs";
describe("Protocol > Requests > Produce > v1", () => {
  describe("request", () => {
    test("use v0 protocol", () => {
      const request = RequestProtocol({});
      const requestV0 = RequestV0Protocol({});
      expect(request.apiKey).toEqual(requestV0.apiKey);
      expect(request.apiName).toEqual(requestV0.apiName);
    });

    test("has the correct apiVersion", () => {
      const request = RequestProtocol({});
      expect(request.apiVersion).toEqual(1);
    });
  });
});
