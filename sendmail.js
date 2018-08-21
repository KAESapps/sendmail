#!/usr/bin/env node
var nodemailer = require("nodemailer");
const simpleParser = require("mailparser").simpleParser;
const path = require("path");
const os = require("os");
const config = require(path.join(os.homedir(), "sendmail-config.json"));
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
}
console.log("using config", config);
const transporter = nodemailer.createTransport(config);

console.log("reading email from stdin");
const source = process.stdin;

simpleParser(source)
  .then(({ headers, to, subject, text, html, textAsHtml }) => {
    from = config.auth.user;
    to = to.text;
    headers = strMapToObj(headers);
    const email = {
      headers,
      from,
      to,
      subject,
      text,
      html,
      textAsHtml
    };
    console.log("sending email", { from, to, subject, headers });
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
