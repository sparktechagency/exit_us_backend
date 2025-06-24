import cron from 'node-cron';
import { Subscription } from '../app/modules/subscription/subscription.model';
import { User } from '../app/modules/user/user.model';

export const cleanUp = () => {
  cron.schedule('0 0 * * *', async () => {
    const expireSubscriptions = await Subscription.find({
      status: 'active',
      endDate: { $lt: new Date() },
    }).lean()

    for (const subscription of expireSubscriptions) {
      await Subscription.findByIdAndUpdate(subscription._id, {
        status: 'expired',
      });
      await User.findByIdAndUpdate(subscription.user, {
        subscription: null,
      });
    }

    await User.deleteMany({
        verified: false,
    })
    
  });
};