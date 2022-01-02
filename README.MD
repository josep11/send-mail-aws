# AWS SES

Send email on AWS SES and expose a CLI interface

## Usage

```bash
send-mail-aws -s "SUBJECT TITLE" [-b "CONTINGUT AMB ESPAIS"]
send-mail-aws --subject="SUBJECT TITLE" [--body="CONTINGUT AMB ESPAIS"]
```

## Install and Configure the environment

### Prerequisites

1. Create an IAM user and give it access to SES API
2. Install node.js

### Install

1. ```git clone https://github.com/josep11/send-mail-aws```
2. ```npm install```
3. Copy the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY into .env file
4. Install it as a global command.

```bash
# cd into the directory and run:
npm install -g ./
```

### To uninstall global

```bash
npm uninstall -g send-email-aws
# If it doesn't work:
which send-email-aws
# cd to that location delete the symbolic link and then cd to the installed location and rm -rf send-email-aws folder
# Now it should not be visible:
npm ls -g --depth=0
# Otherwise rm the link on:
~/.nvm/versions/node/v12.18.4/lib
```

#### If you migrate into a new default node version

```bash
nvm alias default 14.*
```

Then repeat the 4th step on [install](#install)

### To install only locally

Skip step 4 from [Install section](#Install) section and run from the folder:

```bash
./send-mail-aws -h
./send-mail-aws -s "Email Subject" [-b "Content"]
```
