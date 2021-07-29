const dotenv = require('dotenv'); //read env variables from .env file
const result = dotenv.config();
if (result.error) {
    throw result.error;
}

if (!process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY) {
    console.log("Please set both AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables. Aborting")
    process.exit(1)
}

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({ region: 'eu-west-3' });

const SES = new AWS.SES({ apiVersion: '2010-12-01' });
// Create the promise and SES service object

// const sendPromise = SES.getSendQuota().promise();

(async () => {
    const data = await SES.getSendQuota().promise();

    if (data.SentLast24Hours >= data.Max24HourSend){
        console.error(data);
        throw new Error('quota exceded');
    }

    console.log(data);
})();

/* 
// Handle promise's fulfilled/rejected states
sendPromise.then(
    (data) => {
        console.log(data);
    },
).catch(
    (err) => {
        console.error(err, err.stack);
    },
);
 */