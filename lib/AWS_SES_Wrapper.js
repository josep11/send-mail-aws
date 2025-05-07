// Load the AWS SDK for Node.js
// TODO: detect that with lint
const AWS = require("aws-sdk");
const {
  SESClient,
  SendEmailCommand,
  GetSendQuotaCommand,
} = require("@aws-sdk/client-ses");
const path = require("path");
const dotenv = require("dotenv"); //read env variables from .env file
const result = dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// ########### BEGIN CONFIG #############
const source = "it.expanding.sp@gmail.com";
const receiverDefault = "josepalsinasio@gmail.com"; //sandbox mode so we can only send email to verified email addresses
// ########### END CONFIG ###############

if (result.error) {
  throw result.error;
}

const { AWS_REGION } = process.env;

if (!AWS_REGION) {
  console.log("Please define the required env vars. Aborting");
  process.exit(1);
}

const sesClient = new SESClient({
  // The key apiVersion is no longer supported in v3, and can be removed.
  // @deprecated The client uses the "latest" apiVersion.
  apiVersion: "2010-12-01",
  region: AWS_REGION,
});

const sendEmail = async (
  /** @type {string} */ subject,
  /** @type {string} */ body,
  /** @type {string|null} */ receiver = null,
) => {
  receiver = receiver || receiverDefault;

  const params = {
    Source: source,
    Destination: {
      ToAddresses: [receiver],
      CcAddresses: [],
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      ReplyToAddresses: [
        source,
        /* more items */
      ],
    },
  };

  await getSendQuota();

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log(`Email sent ok `);
    console.debug(response);
  } catch (err) {
    console.error(err, err.stack);
    throw err;
  }
};

async function getSendQuota() {
  try {
    const command = new GetSendQuotaCommand({});
    const data = await sesClient.send(command);

    // Calculate percentage used
    const percent = Math.round(
      (data.SentLast24Hours * 100) / data.Max24HourSend,
    );
    if (percent > 0) {
      console.log(`Quota used today: ${percent}% `);
    }
  } catch (error) {
    console.error("Error getting SES quota:", error);
    throw error;
  }
}

module.exports = {
  sendEmail,
};
