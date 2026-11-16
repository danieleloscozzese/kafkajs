/** @type {<T1 extends string>(namespace: T1) => <T2 extends string>(type: T2) => `${T1}.${T2}`} */
const instrumentationEventType = (namespace) => (type) => `${namespace}.${type}`;

export default instrumentationEventType;
