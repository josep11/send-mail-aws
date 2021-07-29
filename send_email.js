const argv = require('yargs').argv;

const printHelp = function () {
    process.stdout.write("\nUSAGE: \n");
    process.stdout.write('send-mail-aws --subject=<title> [--body=body] [-h]\n');
    process.stdout.write('send-mail-aws --subject=<title> [--body=body] [-h]\n');
};

const subject = argv.subject || argv.s;

if (argv.h || !subject) { //help or malformed command
    printHelp();
    process.exit(0);
}

let { body, b } = argv;
body = body || b || 'Default email content';

const { sendEmail } = require('./utils/AWS_SES_Wrapper');
(async () => {
    await sendEmail(subject, body);
})();

