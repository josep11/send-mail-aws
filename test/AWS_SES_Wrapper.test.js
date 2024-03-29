/*global before, after, describe, it */
const assert = require("assert");
const { sendEmail } = require("../lib/AWS_SES_Wrapper");

describe("Renew tests", () => {
	it("Should wait for global variable in the page context to be set to true", async () => {
		const subject = "test";
		const body = "test body";
		// const receiver = "javierab.iglesias@gmail.com";
		const receiver = "it.expanding.sp@gmail.com";

		try {
			await sendEmail(subject, body, receiver);
		} catch (err) {
			assert.fail("failed to send email: " + err);
		}
	});
});
