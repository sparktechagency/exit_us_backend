import twilio from 'twilio';
import config from '../config';
import { phoneTamplate } from '../shared/messageTemplate';
import { logger } from '../shared/logger';

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

export const sendVerificationCode = async (phone: string,otp:number) => {

    const message = await client.messages.create({
      body:phoneTamplate.sendPhoneValidationMessage(otp),
      from: config.twilio.fromPhone,
      to: phone,
      
    });
    logger.info('SMS send to phone: ' + message);
}

export const phoneHelper = {
    sendVerificationCode,
};

