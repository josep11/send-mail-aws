const path = require("path");
const dotenv = require("dotenv"); //read env variables from .env file
//TODO: for clu global perhaps there is a better way to grab the project root
const result = dotenv.config({
	path: path.resolve(__dirname, "../.env"),
});

if (result.error) {
	throw result.error;
}

/*
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
	console.log(
		"Please set both AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables. Aborting"
	);
	process.exit(1);
}
*/

// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");

const { SES } = require("@aws-sdk/client-ses");

// Set the region
// TODO: bring it to env variable
// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
AWS.config.update({ region: "eu-west-3" });

const source = "it.expanding.sp@gmail.com";
const receiverDefault = "josepalsinasio@gmail.com"; //sandbox mode so we can only send email to verified email addresses

const SES = new SES({
	// The key apiVersion is no longer supported in v3, and can be removed.
	// @deprecated The client uses the "latest" apiVersion.
	apiVersion: "2010-12-01",

	region: "eu-west-3",
});

const sendEmail = async (
	/** @type {string} */ subject,
	/** @type {string} */ body,
	/** @type {string|null} */ receiver = null
) => {
	receiver = receiver || receiverDefault;

	const params = {
		Destination: {
			/* required */
			ToAddresses: [receiver],
			CcAddresses: [],
		},
		Message: {
			/* required */
			Body: {
				/* required */
				// Html: {
				//     Charset: 'UTF-8',
				//     Data: 'HTML_FORMAT_BODY',
				// },
				Text: {
					Charset: "UTF-8",
					Data: body,
				},
			},
			Subject: {
				Charset: "UTF-8",
				Data: subject,
			},
		},
		Source: source /* required */,
		ReplyToAddresses: [
			source,
			/* more items */
		],
	};

	// Create the promise and SES service object and await it

	await getQuota();

	try {
		let data = await SES.sendEmail(params);
		console.log(`Email sent ok `);
	} catch (err) {
		console.error(err, err.stack);
		throw err;
	}
};

async function getQuota() {
	let data = await SES.getSendQuota(); //get the Quota

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
