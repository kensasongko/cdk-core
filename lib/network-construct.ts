//import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface NetworkConstructProps {
  vpcCidr: string;
  maxAzs: number;
}

export class NetworkConstruct extends Construct {
  constructor(scope: Stack, id: string, props: NetworkConstructProps) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      cidr: props.vpcCidr,
      maxAzs: props.maxAzs,
      subnetConfiguration: [
        {
          name: 'PublicSubnet',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 23,
        },
        {
          name: 'PrivateSubnet',
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
          cidrMask: 23,
        },
        {
          name: 'IsolatedSubnet',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 23,
        },
      ],
    });

    new ec2.InterfaceVpcEndpoint(this, 'SecretsManagerEndpoint', {
      vpc: vpc,
      service: new ec2.InterfaceVpcEndpointService('com.amazonaws.' + scope.region + '.secretsmanager', 443),
      privateDnsEnabled: true,
    });

    new ssm.StringParameter(this, 'VpcId', {
      parameterName: '/cdk/core/vpc-id',
      stringValue: vpc.vpcId,
      tier: ssm.ParameterTier.STANDARD,
    });
  }
}
