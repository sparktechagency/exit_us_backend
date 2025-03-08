import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { EventRoutes } from '../app/modules/event/event.route';
import { MeetupRoutes } from '../app/modules/meetup/meetup.route';
import { ExperienceRoutes } from '../app/modules/experience/experience.route';
import { ReelRoutes } from '../app/modules/reel/reel.route';
import { DonationRoute } from '../app/modules/donate/donate.route';
import { TranslatorRoutes } from '../app/modules/translateor/translator.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path:"/event",
    route: EventRoutes
  },
  {
    path: '/meetup',
    route: MeetupRoutes,
  },
  {
    path:"/experience",
    route:ExperienceRoutes
  },
  {
    path:"/reel",
    route: ReelRoutes
  },
  {
    path:"/donate",
    route: DonationRoute
  },
  {
    path:"/translator",
    route: TranslatorRoutes
  }
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
