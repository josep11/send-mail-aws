#!/usr/bin/env node
const argv = require('yargs').argv;
// console.log(`clu running on ${process.cwd()}`);

const printHelp = function () {
    process.stdout.write("\nUSAGE: \n");
    process.stdout.write('send-mail-aws -s <title> [-b body] [-h]\n');
    process.stdout.write('send-mail-aws --subject=<title> [--body=body] [-h]\n');
};

const subject = argv.subject || argv.s;

if (argv.h || !subject) { //help or malformed command
    printHelp();
    process.exit(0);
}

let { body, b } = argv;
body = body || b || 'Default email content';

const { sendEmail } = require('../lib/AWS_SES_Wrapper');
(async () => {
    await sendEmail(subject, body);
})();

