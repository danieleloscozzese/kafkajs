---
id: development-environment
title: Development Environment
---

When developing KafkaJS, we run a Kafka cluster in a similar way to what is described in [Running Kafka in Development](DockerLocal.md), using [`docker`](https://docs.docker.com/) and the [`docker compose`](https://docs.docker.com/compose/install/) plugin. Before you proceed, make sure both are available.

Install the project dependencies with `npm ci` and run the test suite with `npm test`.

## Running Kafka

For testing KafkaJS we use a multi-broker Kafka cluster as well as Zookeeper for authentication. To start the cluster and generate credentials, run the following from the root of the repository:

```sh
# This will run a Kafka cluster configured with your current IP
./scripts/dockerComposeUp.sh
./scripts/createScramCredentials.sh
```

This boots the Kafka cluster using the canonical `docker-compose.yml` file. To inspect the running cluster, run:

```sh
$ docker compose -f docker-compose.yml ps
NAME      COMMAND          STATE   PORTS
...
```

The user credentials are listed in [scripts/createScramCredentials.sh](https://github.com/tulios/kafkajs/blob/master/scripts/createScramCredentials.sh). You can also pass in the `-h` flag to this script for more details and controls. 

You should now be able to connect to your cluster as such:

```javascript
const fs = require('fs')
const ip = require('ip')

const { Kafka, CompressionTypes, logLevel } = require('./index')

const host = process.env.HOST_IP || ip.address()

const kafka = new Kafka({
  logLevel: logLevel.DEBUG,
  brokers: [`${host}:9094`, `${host}:9097`, `${host}:9100`],
  clientId: 'example-producer',
  ssl: {
    servername: 'localhost',
    rejectUnauthorized: false,
    ca: [fs.readFileSync('./testHelpers/certs/cert-signed', 'utf-8')],
  },
  sasl: {
    mechanism: 'plain',
    username: 'test',
    password: 'testtest',
  },
})
```

## Visual Studio Code Integration

In order to [better integrate with Visual Studio Code's Javascript Language Service](https://code.visualstudio.com/docs/languages/jsconfig),
you can add a `jsconfig.json` file to the root of the project.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "module": "commonjs",
    "target": "es6",
    "paths": {
      "testHelpers": ["./testHelpers"]
    }
  },
  "include": [
    "src",
    "testHelpers"
  ]
}
```

This can help Visual Studio Code show type-hints even for modules that don't directly import each other:

![Editor screenshot showing type hinting for Cluster methods](./assets/vscode-integration.png)
