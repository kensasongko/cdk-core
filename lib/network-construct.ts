//import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface NetworkConstructProps {
  vpcCdir: string;
  maxAzs: number;
}

export class NetworkConstruct extends Construct {
  constructor(scope: Stack, id: string, props: NetworkConstructProps) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'vpc', {
      cidr: props.vpcCdir,
      maxAzs: props.maxAzs,
      subnetConfiguration: [
        {
          name: 'public-subnet-1',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 23,
        },
        {
          name: 'private-subnet-1',
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
          cidrMask: 23,
        },
        {
          name: 'isolated-subnet-1',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 23,
        },
      ],
    });

    new ssm.StringParameter(this, 'VpcId', {
      parameterName: '/Cdk/Core/VpcId',
      stringValue: vpc.vpcId,
      tier: ssm.ParameterTier.STANDARD,
    });
  }
}
