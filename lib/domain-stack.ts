import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as ssm from 'aws-cdk-lib/aws-ssm';

//import { DomainConstruct } from '../lib/domain-construct';

export class DomainStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    //const domainConstruct = new DomainConstruct(this, 'DomainConstruct');
    const domain = ssm.StringParameter.fromStringParameterAttributes(this, 'Domain', {
      parameterName: '/cdk/bootstrap/domain',
    }).stringValue;

    const zone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: domain,
    });

    new ssm.StringParameter(this, 'HostedZoneId', {
      parameterName: '/cdk/core/hosted-zone-id',
      stringValue: zone.hostedZoneId,
      tier: ssm.ParameterTier.STANDARD,
    });
  }
}
