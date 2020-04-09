# CDK Hello World

A basic Node webserver with DB with AWS CDK/Cloudformation deployment.

## Setup

```
git clone https://github.com/jmeyers91/cdk-hello-world
cd cdk-hello-world
npm i
npm run build
npm run deploy
```

Or deploy to a different stack name:

```
STACK_NAME=foobar npm run deploy
```

Working IAM policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "s3:*",
        "rds:*",
        "ec2:*",
        "cloudformation:*",
        "logs:*",
        "ecs:*",
        "ecr:*",
        "ssm:*",
        "sns:*",
        "elasticloadbalancing:*",
        "iam:*",
        "autoscaling:*",
        "lambda:*"
      ],
      "Resource": "*"
    }
  ]
}
```
