const { Kafka, logLevel } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'consumer',
    brokers: ['kafka1:9092', 'kafka2:9092', 'kafka3:9092' ],
    logLevel: logLevel.DEBUG,
});

const consumer = kafka.consumer({groupId: 'test-group', sessionTimeout: 7000});

async function main() {
    await consumer.connect();
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                value: message.value.toString(),
            });
            console.log('Done!');
            process.exit();
        },
    })
}

main();