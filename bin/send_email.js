#!/usr/bin/env node
const argv = require("yargs").argv;
// console.log(`clu running on ${process.cwd()}`);

const printHelp = function () {
	process.stdout.write("\nUSAGE: \n");
	process.stdout.write("send-mail-aws -s <title> [-b body] [-r me@it.com] [-h]\n");
	process.stdout.write("send-mail-aws --subject=<title> [--body=body] [--receiver=me@gmail.com] [-h]\n");
};

const subject = argv.subject || argv.s;

if (argv.h || !subject) {
	//help or malformed command
	printHelp();
	process.exit(0);
}

let { body, b } = argv;
body = body || b || "Default email content";

let { receiver, r } = argv;
receiver = receiver || r || null;

const { sendEmail } = require("../lib/AWS_SES_Wrapper");
(async () => {
	await sendEmail(subject, body, receiver);
})();
