import paypal from 'paypal-rest-sdk';
import config from '../config';

paypal.configure({
  mode: 'sandbox', // Change to 'live' for production
  client_id: config.paypal.client_id! ,
  client_secret: config.paypal.client_secret!,
});
function paypalJson(amount:number){
    return {
        intent: 'sale',
        payer: {
          payment_method: 'paypal',
        },
        redirect_urls: {
          return_url: 'http://localhost:3000/success', // Your success URL
          cancel_url: 'http://localhost:3000/cancel',  // Your cancel URL
        },
        transactions: [
          {
            amount: {
              total: amount.toString(),
              currency: 'USD',
            },
            description: 'Donation Payment',
          },
        ],
      };
}
export const PaypalHelper = {
    paypal,
    paypalJson,
}
