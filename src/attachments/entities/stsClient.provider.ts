import { FactoryProvider } from '@nestjs/common';
import { STSClient, STSClientConfig } from '@aws-sdk/client-sts';

const STSClientProvider: FactoryProvider<STSClient> = {
  provide: STSClient,
  useFactory: () => {
    const stsOptions: STSClientConfig = {
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    };

    return new STSClient(stsOptions);
  },
};

export { STSClientProvider };
