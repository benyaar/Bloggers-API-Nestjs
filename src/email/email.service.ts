import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(email: string, subject: string, text: string) {
    // Отправка почты
    const sendEmail = await this.mailerService.sendMail({
      from: '"Artur" <apitestblogger@gmail.com>', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: text,
    });
    return;
  }
}
