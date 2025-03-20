import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import notificationModel from '../models/notification.models';
import { AuthenticatedRequest } from '../middlewares/auth.middlewares';

export const notificationRouter = Router();


notificationRouter.post(
    '/send-notification',
    asyncHandler(
        async (
            req: AuthenticatedRequest<
                unknown,
                unknown,
                unknown,
                {
                    entity_id: number;
                    user_id: number;
                }
            >,
            res
        ) => {
            const { entity_id, user_id } = req.query;
            await notificationModel.sendNotification({
                user_id,
                entity_id,
                title : 'Test Notification',
                body:'Hi',
            });
            res.status(201).json({ message: 'send' });
        }
    )
);
// notificationRouter.get("/generateKeys", async (req, res) => {
//     const vapidKeys = webPush.generateVAPIDKeys();
//     res.send({
//         public_key : vapidKeys.publicKey,
//         private_key : vapidKeys.privateKey
//     });
// });

notificationRouter.post(
    '/subscribe',
    asyncHandler(
        async (
            req: AuthenticatedRequest<
                unknown,
                unknown,
                {
                    endpoint: string;
                    p256dh: string;
                    auth: string;
                },
                {
                    entity_id: number;
                }
            >,
            res
        ) => {
            const { endpoint, p256dh, auth } = req.body;
            await notificationModel.subscriobeUser({
                user_id: req.user.user_id,
                entity_id: req.query.entity_id,
                endpoint,
                p256dh,
                auth,
            });
            res.status(201).json({ message: 'Subscribed' });
        }
    )
);

export default notificationRouter;
