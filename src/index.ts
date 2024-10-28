import express from "express";
import { Queue } from "bullmq";
import { addUserToCourseQuery } from "./utils/course";
import { mockSendEmail } from "./utils/email";

const app = express();
const PORT = process.env.PORT ?? 8000;

//hosted the instance on aiven platform
const emailQueue = new Queue("email-queue", {
  connection: {
    host: "redis-f857e6a-pranshu988.f.aivencloud.com",
    port: 23727,
    username: "default",
    password: "AVNS_G9mhJLmdz7qf6juJlC7",
  },
});

app.get("/", (req, res) => {
  return res.json({ status: "success", message: "Hello from Express Server" });
});

app.post("/add-user-to-course", async (req, res) => {
  console.log("Adding user to course");
  // Critical
  await addUserToCourseQuery();
  //Sending email via Queue
  await emailQueue.add(`${Date.now()}`, {
    from: "pranshu@gmail.com",
    to: "student@gmail.com",
    subject: "Congrats on enrolling in Twitter Course",
    body: "Dear Student, You have been enrolled to Twitter Clone Course.",
  });
  //earlier it blocking the critical task
  // await mockSendEmail({
  //   from: "pranshu@gmail.com",
  //   to: "student@gmail.com",
  //   subject: "Congrats on enrolling in Twitter Course",
  //   body: "Dear Student, You have been enrolled to Twitter Clone Course.",
  // });

  return res.json({ status: "success", data: { message: "Enrolled Success" } });
});

app.listen(PORT, () => console.log(`Express Server Started on PORT:${PORT}`));
