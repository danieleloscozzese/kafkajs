import scram0 from "./scram.mjs";

const { SCRAM, DIGESTS } = scram0;

const scram256AuthenticatorProvider =
  (sasl) =>
  ({ host, port, logger, saslAuthenticate }) => {
    const scram = new SCRAM(sasl, host, port, logger, saslAuthenticate, DIGESTS.SHA256);
    return {
      authenticate: async () => await scram.authenticate(),
    };
  };

export default scram256AuthenticatorProvider;
