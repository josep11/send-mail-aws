// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
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
	/** @type {string|null} */ receiver = null
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

	await getQuota();

	try {
		let data = await sesClient.sendEmail(params);
		console.log(`Email sent ok `);
	} catch (err) {
		console.error(err, err.stack);
		throw err;
	}
};

async function getQuota() {
	let data = await sesClient.getSendQuota(); //get the Quota

	if (data.SentLast24Hours >= data.Max24HourSend) {
		console.error(data);
		throw new Error("quota exceded");
	}
	const percent = Math.round((data.SentLast24Hours * 100) / data.Max24HourSend);
	if (percent > 0) {
		console.log(`Quota used today: ${percent}% `);
	}
	// console.log(data);
}

module.exports = {
	sendEmail,
};
