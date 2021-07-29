# AWS SES

Send email on AWS SES and expose a CLI interface

## Install and Configure the environment

### Prerequisites

1. Create an IAM user and give it access to SES API
2. Install node.js

### Install

1. ```git clone https://github.com/josep11/aws-ses-clu```
2. Copy the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY into .env file
3. run

```bash
./send-mail-aws -h
./send-mail-aws title "content"
```

## To install it on a new computer as a command

Add this function to .bash_profile or equivalentes with the root of the directory accordingly:

```bash
function send-mail-aws(){
 SEND_MAIL_AWS_ROOT=$HOME/node/aws/aws-ses
 $SEND_MAIL_AWS_ROOT/send-mail-aws $@
}
```

Then you can run it like a global command:

```bash
send-mail-aws SUBJECT_TITLE "CONTINGUT AMB ESPAIS"
```
