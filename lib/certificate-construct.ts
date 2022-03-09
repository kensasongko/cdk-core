//import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

export class CertificateConstruct extends Construct {
  constructor(scope: Stack, id: string) {
    super(scope, id);
    console.log(scope.region);

    const domain = ssm.StringParameter.valueFromLookup(this, '/Cdk/Bootstrap/Domain');
    //const hostedZoneId = ssm.StringParameter.valueFromLookup(this, '/Cdk/Bootstrap/hostedZoneId');
    //console.log(domain);

    const zone = route53.HostedZone.fromLookup(this, 'Zone', { 
      domainName: domain,
    });

    const certificate = new acm.DnsValidatedCertificate(this, 'WildcardCertificate', {
      domainName: '*.' + zone.zoneName,
      hostedZone: zone,
    });

    new ssm.StringParameter(this, 'WildcardCertificateArn', {
      parameterName: '/Cdk/Core/WildcardCertificateArn',
      stringValue: certificate.certificateArn,
      tier: ssm.ParameterTier.STANDARD,
    });
  }
}
