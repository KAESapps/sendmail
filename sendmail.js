#!/usr/bin/env node
var nodemailer = require("nodemailer");
const simpleParser = require("mailparser").simpleParser;
const path = require("path");
const os = require("os");
const config = require(path.join(os.homedir(), "sendmail-config.json"));

console.log("using config", config);
const transporter = nodemailer.createTransport(config);

console.log("reading email from stdin");
const source = process.stdin;

simpleParser(source)
  .then(({ to, subject, text, html, textAsHtml }) => {
    from = config.auth.user;
    to = to.text;
    const email = {
      from,
      to,
      subject,
      text,
      html,
      textAsHtml
    };
    console.log("sending email", { from, to, subject });
    return transporter.sendMail(email);
  })
  .then(res => {
    console.log(res);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
