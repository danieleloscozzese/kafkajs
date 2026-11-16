import scram0 from "./scram.mjs";

const { SCRAM, DIGESTS } = scram0;

const scram512AuthenticatorProvider =
  (sasl) =>
  ({ host, port, logger, saslAuthenticate }) => {
    const scram = new SCRAM(sasl, host, port, logger, saslAuthenticate, DIGESTS.SHA512);
    return {
      authenticate: async () => await scram.authenticate(),
    };
  };

export default scram512AuthenticatorProvider;
