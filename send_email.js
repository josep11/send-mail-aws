const dotenv = require('dotenv'); //read env variables from .env file
const result = dotenv.config();
if (result.error) {
    throw result.error;
}

const argv = require('yargs').argv;

if (!process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY) {
    console.log("Please set both AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables. Aborting")
    process.exit(1)
}

const printHelp = function () {
    process.stdout.write("\nUSAGE: \n");
    process.stdout.write('send-mail-aws <title> [body] [-h]\n');
};

if (argv.h) {
    printHelp();
    process.exit(0);
}

const args = process.argv.slice(2); //args are: subject content
if (args.length < 1) {
    printHelp();
    process.exit(1); //FAILURE
}

const [subject, content = 'default content'] = args;

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({ region: 'eu-west-3' });

const source = 'it.expanding.sp@gmail.com';
const receiver = 'josepalsinasio@gmail.com'; //sandbox mode so we can only send email to verified email addresses
// Create sendEmail params
const params = {
    Destination: { /* required */
        CcAddresses: [
            // 'EMAIL_ADDRESS',
            /* more items */
        ],
        ToAddresses: [
            receiver,
            /* more items */
        ],
    },
    Message: { /* required */
        Body: { /* required */
            // Html: {
            //     Charset: 'UTF-8',
            //     Data: 'HTML_FORMAT_BODY',
            // },
            Text: {
                Charset: 'UTF-8',
                Data: content,
            },
        },
        Subject: {
            Charset: 'UTF-8',
            Data: subject,
        },
    },
    Source: source, /* required */
    ReplyToAddresses: [
        source,
        /* more items */
    ],
};


const SES = new AWS.SES({ apiVersion: '2010-12-01' });

(async () => {
    // Create the promise and SES service object and await it

    /* ******************* */
    /* GET THE QUOTA BEGIN */
    /* ******************* */
    let data = await SES.getSendQuota().promise(); //get the Quota

    if (data.SentLast24Hours >= data.Max24HourSend) {
        console.error(data);
        throw new Error('quota exceded');
    }
    const percent = Math.round((data.SentLast24Hours * 100) / data.Max24HourSend);
    console.log(`Quota % used today ${percent}% `);
    // console.log(data);
    /* ******************* */
    /*  GET THE QUOTA END  */
    /* ******************* */


    try {
        data = await SES.sendEmail(params).promise();
        console.log(`Email sent ok `);
    } catch (error) {
        console.error(err, err.stack);
        throw error;
    }

})();
