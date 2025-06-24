import paypal from 'paypal-rest-sdk';
import config from '../config';
import axios from 'axios';

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
          return_url: `${config.baseUrl.baseUrl}/donate/verify-donation`, // Your success URL
          cancel_url: `${config.baseUrl.baseUrl}`,  // Your cancel URL
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


export async function getAccessToken() {
  const base64 = Buffer.from(`${config.paypal.client_id}:${config.paypal.client_secret}`).toString('base64');

  const res = await axios.post('https://api-m.paypal.com/v1/oauth2/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Authorization': `Basic ${base64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }
  );

  return res.data.access_token;
}

const createDonationPaypal = async (amount:string) => {
  const token = await getAccessToken();
  const res = await axios.post(
    'https://api-m.sandbox.paypal.com/v2/checkout/orders',
    {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount,
        },
        description: 'Donation',
      }],
      application_context: {
        return_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel'
      }
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    }
  );
  const {links} = await res.data;
  const approvalUrl = links.find((link:any) => link.rel === 'approve').href;  
  return approvalUrl;
  
}
export const PaypalHelper = {
    paypal,
    paypalJson,
    createDonationPaypal,
}
