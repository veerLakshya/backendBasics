const amqp = require("amqplib");

connect();

async function connect() {
  try {
    const amqpServer =
      "amqps://skmzibfd:SrtOg7wed3VuaBx3etPdnG9KOJgYr3fz@puffin.rmq2.cloudamqp.com/skmzibfd";
    const connection = await amqp.connect(amqpServer);
    const channel = await connection.createChannel();
    await channel.assertQueue("jobs");

    channel.consume("jobs", (data) => {
      const input = JSON.parse(data.content.toString());
      console.log(`Received job with input ${input.number}`);

      if (input.number % 2 == 0) {
        channel.ack(data);
        console.log(`Job with input ${input.number} is done`);
      }
    });

    console.log("Waiting for messages...");
  } catch (err) {
    console.error(err);
  }
}
