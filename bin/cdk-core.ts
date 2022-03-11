#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { DomainStack } from '../lib/domain-stack';
import { CoreStack } from '../lib/core-stack';

/*
const devenv  = { account: 'XXX', region: 'ap-southeast-1' };
const prodenv = { account: 'XXX', region: 'ap-southeast-1' }
*/
const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };
const devEnv = env;
const prodEnv = env;

const app = new cdk.App();

/*
If you have not setup a hosted zone in Route53 Before deploying *CoreStack, deploy Bootstrap*DomainStack
and point domain's NS to Route53's NS. Otherwise, generating certificate will not work.
*/

// Start Dev
new DomainStack(app, 'BootstrapDevDomainStack', {
  env: devEnv,
});

new CoreStack(app, 'DevCoreStack', {
  env: devEnv,
  vpcCidr: "10.1.0.0/16",
  maxAzs: 2,
});
// End Dev

// Start Prod
new DomainStack(app, 'BootstrapProdDomainStack', {
  env: prodEnv,
});

new CoreStack(app, 'ProdCoreStack', {
  env: prodEnv,
  vpcCidr: "10.2.0.0/16",
  maxAzs: 3,
});
// End Prod
