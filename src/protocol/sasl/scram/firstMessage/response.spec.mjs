import { describe, test, expect } from "@jest/globals";
import response from "./response.mjs";
import responseFixture from "./fixtures/response.json" with { type: "json" };

const { decode, parse } = response;

describe("Protocol > sasl > scram > firstMessage", () => {
  test("response", async () => {
    const data = await decode(Buffer.from(responseFixture));
    await expect(parse(data)).resolves.toEqual({
      original:
        "r=IQi00EZwusKw0Io7FoBfqg1c7im78cnh566cwt0watlspw4p,s=bHcyM3p5bWk5aXF4OWM3cmswZHM5N2w0cA==,i=8192",
      r: "IQi00EZwusKw0Io7FoBfqg1c7im78cnh566cwt0watlspw4p",
      s: "bHcyM3p5bWk5aXF4OWM3cmswZHM5N2w0cA==",
      i: "8192",
    });
  });

  test.each(["", "x=unsupported", "r=nonce,missing-equals"])(
    "rejects malformed attributes in %s",
    async (message) => {
      await expect(parse(Buffer.from(message))).rejects.toMatchObject({ name: "TypeError" });
    },
  );
});
