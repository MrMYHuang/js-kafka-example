const { Kafka, logLevel } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'producer',
  brokers: ['kafka1:9092', 'kafka2:9092', 'kafka3:9092'],
  logLevel: logLevel.DEBUG,
});

const admin = kafka.admin();
const producer = kafka.producer();

async function main() {
  try {
    await admin.connect();
    await admin.createTopics({
      waitForLeaders: true,
      topics: [
        {
          topic: 'test-topic',
          numPartitions: 3,
          replicationFactor: 3,
        }
      ]
    });
    await admin.disconnect();
  } catch (error) {
    console.log(error);
  }

  try {
    await producer.connect()
    await producer.send({
      topic: 'test-topic',
      messages: [
        { value: 'Hello!' },
      ],
      acks: 1
    })
    console.log('Done!');

    await producer.disconnect();
  } catch (error) {
    console.log(error);
  }
}

main();
