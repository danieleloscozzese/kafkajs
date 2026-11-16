import Decoder from "../../../decoder.mjs";

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "_" }] */

const ENTRY_REGEX = /^([rsiev])=(.*)$/;

const responseProtocol = {
  decode: async (rawData) => {
    return new Decoder(rawData).readBytes();
  },
  parse: async (data) => {
    const processed = data
      .toString()
      .split(",")
      .map((str) => {
        const [_, key, value] = str.match(ENTRY_REGEX);
        return [key, value];
      })
      .reduce((obj, entry) => ({ ...obj, [entry[0]]: entry[1] }), {});

    return { original: data.toString(), ...processed };
  },
};

export default responseProtocol;
