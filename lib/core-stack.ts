import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { DomainConstruct } from '../lib/domain-construct';
import { NetworkConstruct } from '../lib/network-construct';
import { CertificateConstruct } from '../lib/certificate-construct';

interface CoreStackProps extends StackProps {
  vpcCdir: string;
  maxAzs: number;
}

export class CoreStack extends Stack {
  constructor(scope: Construct, id: string, props: CoreStackProps) {
    super(scope, id, props);

    new NetworkConstruct(this, 'NetworkConstruct', {
      vpcCdir: props.vpcCdir,
      maxAzs: props.maxAzs,
    });
    //const domainConstruct = new DomainConstruct(this, 'DomainConstruct');
    new CertificateConstruct(this, 'CertificateConstruct');
  }
}
