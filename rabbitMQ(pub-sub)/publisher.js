// RabbitMQ Publisher (Sender)

const amqp = require("amqplib");

const msg = { number: process.argv[2] };

connect();

async function connect() {
  try {
    const amqpServer =
      "amqps://skmzibfd:SrtOg7wed3VuaBx3etPdnG9KOJgYr3fz@puffin.rmq2.cloudamqp.com/skmzibfd";
    const connection = await amqp.connect(amqpServer);
    const channel = await connection.createChannel();
    await channel.assertQueue("jobs");
    await channel.sendToQueue("jobs", Buffer.from(JSON.stringify(msg)));
    console.log(`Job Sent ${msg.number}`);
    await channel.close();
    await connection.close();
  } catch (err) {
    console.error(err);
  }
}
