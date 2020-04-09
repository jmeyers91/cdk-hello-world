import ec2 = require("@aws-cdk/aws-ec2");
import ecs = require("@aws-cdk/aws-ecs");
import cdk = require("@aws-cdk/core");
import { RemovalPolicy, SecretValue } from "@aws-cdk/core";
import rds = require("@aws-cdk/aws-rds");
import ecsPatterns = require("@aws-cdk/aws-ecs-patterns");
import path = require("path");
import { Port, InstanceClass, InstanceSize } from "@aws-cdk/aws-ec2";

const app = new cdk.App();
const stack = new cdk.Stack(app, process.env.STACK_NAME || "HelloWorld");

const vpc = new ec2.Vpc(stack, "MyVpc", { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, "Cluster", { vpc });
const databaseUser = "app";
const databasePassword = "secret123";
const databasePort = 5432;
const databaseName = "app_db";

cluster.addCapacity("cluser_capacity", {
  instanceType: ec2.InstanceType.of(InstanceClass.T2, InstanceSize.NANO),
  maxCapacity: 1,
});

const database = new rds.DatabaseInstance(stack, "Instance", {
  engine: rds.DatabaseInstanceEngine.POSTGRES,
  instanceClass: ec2.InstanceType.of(
    ec2.InstanceClass.BURSTABLE2,
    ec2.InstanceSize.MICRO
  ),
  removalPolicy: RemovalPolicy.DESTROY,
  masterUsername: databaseUser,
  masterUserPassword: new SecretValue(databasePassword),
  port: databasePort,
  databaseName,
  vpc,
});

const apiService = new ecsPatterns.ApplicationLoadBalancedEc2Service(
  stack,
  "AppService",
  {
    cluster,
    memoryLimitMiB: 512,
    taskImageOptions: {
      environment: {
        PORT: "3000",
        DATABASE_URL: `postgres://${databaseUser}:${databasePassword}@${database.dbInstanceEndpointAddress}:${databasePort}/${databaseName}`,
      },
      containerPort: 3000,
      image: ecs.ContainerImage.fromAsset(
        path.resolve(__dirname, "..", "local-image")
      ),
    },
  }
);

database.connections.allowFrom(apiService.service, Port.tcp(databasePort));

app.synth();
