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
// Set the region
// TODO: bring it to env variable
AWS.config.update({ region: "eu-west-3" });

const source = "it.expanding.sp@gmail.com";
const receiver = "josepalsinasio@gmail.com"; //sandbox mode so we can only send email to verified email addresses

const SES = new AWS.SES({ apiVersion: "2010-12-01" });

const sendEmail = async (subject, body) => {
	const params = {
		Destination: {
			/* required */
			CcAddresses: [
				// 'EMAIL_ADDRESS',
				/* more items */
			],
			ToAddresses: [
				receiver,
				/* more items */
			],
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

	/* ******************* */
	/* GET THE QUOTA BEGIN */
	/* ******************* */
	let data = await SES.getSendQuota().promise(); //get the Quota

	if (data.SentLast24Hours >= data.Max24HourSend) {
		console.error(data);
		throw new Error("quota exceded");
	}
	const percent = Math.round((data.SentLast24Hours * 100) / data.Max24HourSend);
	console.log(`Quota used today: ${percent}% `);
	// console.log(data);
	/* ******************* */
	/*  GET THE QUOTA END  */
	/* ******************* */

	try {
		data = await SES.sendEmail(params).promise();
		console.log(`Email sent ok `);
	} catch (err) {
		console.error(err, err.stack);
		throw err;
	}
};

module.exports = {
	sendEmail,
};
