#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { CoreStack } from '../lib/core-stack';

const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };

const app = new cdk.App();

const config = app.node.tryGetContext('config');
const envConfig = app.node.tryGetContext(config);
const deployConfig = {
  vpcCdir: envConfig['vpcCdir'],
  maxAzs: envConfig['maxAzs'],
//  subnetType: ec2.SubnetType[(envConfig['subnetType']) as keyof typeof ec2.SubnetType],
}

console.log(deployConfig);

new CoreStack(app, 'CoreStack', {
  env: env,
  vpcCdir: deployConfig.vpcCdir,
  maxAzs: deployConfig.maxAzs,
});
