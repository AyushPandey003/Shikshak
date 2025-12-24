const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "shiksha",
    brokers: ["localhost:9092"],
});


async function init() {
    const admin = kafka.admin();
    console.log("Admin connecting...");
    await admin.connect();
    console.log("Adming Connection Success...");

    console.log("Creating Topic [rider-updates]");
    await admin.createTopics({
        topics: [
            {
                topic: "module_created",
                numPartitions: 3,
            },
            {
                topic: "payment_done",
                numPartitions: 3,
            },
            {
                topic: "materail_data",
                numPartitions: 3,
            },
            {
                topic: "course",
                numPartitions: 3,
            },
        ],
    });
    console.log("Topic Created Success");

    console.log("Disconnecting Admin..");
    await admin.disconnect();
}

init();




// docker exec -it Kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list