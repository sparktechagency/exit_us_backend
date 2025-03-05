import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { EventRoutes } from '../app/modules/event/event.route';
import { MeetupRoutes } from '../app/modules/meetup/meetup.route';
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
  }
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
