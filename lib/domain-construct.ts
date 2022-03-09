import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as route53 from 'aws-cdk-lib/aws-route53';

export class DomainConstruct extends Construct {
  public readonly zone: route53.PublicHostedZone;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const domain = ssm.StringParameter.fromStringParameterAttributes(this, 'Domain', {
      parameterName: '/Cdk/Bootstrap/Domain',
    }).stringValue;

    this.zone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: domain,
    });
  }
}
