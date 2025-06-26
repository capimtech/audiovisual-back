import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SES } from 'aws-sdk';
import { EmailSettings } from './sendmail.controller';

@Injectable()
export class SendmailService {
  private client: SES;

  constructor(private readonly configService: ConfigService) {
    this.client = new SES();
  }

  async send(mail: EmailSettings) {
    try {
      await this.client
        .sendEmail({
          Source: `${process.env.SENDMAIL_NAME} <${process.env.SENDMAIL_EMAIL}>`,
          Destination: {
            ToAddresses: [mail.to],
          },
          Message: {
            Subject: {
              Data: mail.subject,
            },
            Body: {
              Html: {
                Data: mail.html,
                Charset: 'utf-8',
              },
              Text: {
                Data: mail.text,
              },
            },
          },
          // ConfigurationSetName: 'OnePlay',
        })
        .promise();
      console.log(`Email successfully dispatched to ${mail.to}`);
    } catch (error) {
      console.error('Error', error);
    }
  }
}
