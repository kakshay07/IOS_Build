import { query } from '../utils/db';
import { ApiError } from '../utils/ApiError';
import webPush from 'web-push';
class notificationModel {
    static async subscriobeUser(data: {
        entity_id: number;
        user_id: number;
        endpoint: string;
        p256dh: string;
        auth: string;
    }) {
        const { entity_id, user_id, endpoint, p256dh, auth } = data;
        await this.unsubscriobeUser(data);

        const _query = `INSERT into notification_subscription (entity_id, user_id, endpoint, p256dh, auth, is_active, cr_on) values (?,?,?,?,?,?,NOW())`;
        const _params = [entity_id, user_id, endpoint, p256dh, auth, 1];
        const response = await query(_query, _params);
        if (response.result) {
            return;
        } else {
            throw new ApiError(
                400,
                'Could Not Subscribe to Notification! Please login again.'
            );
        }
    }

    static async unsubscriobeUser(data: {
        entity_id: number;
        user_id: number;
    }) {
        const { entity_id, user_id } = data;
        const _query = `UPDATE notification_subscription set is_active = 0 where entity_id = ? and user_id = ?`;
        const _params = [entity_id, user_id];
        await query(_query, _params);
    }

    static async getSubscriptions(data: {
        entity_id: number;
        user_id: number;
    }) {
        const { entity_id, user_id } = data;
        const _query = `SELECT * from notification_subscription where entity_id = ? and user_id = ? and is_active = 1`;
        const _params = [entity_id, user_id];
        const resposne = await query(_query, _params);
        return resposne.data || [];
    }

    static async sendNotification(data: {
        entity_id: number;
        user_id: number;
        title: string;
        body: string;
        icon?: string;
        url?: string;
    }) {
        let { entity_id, user_id, title, body, icon, url } = data;
        icon = icon
            ? icon
            : 'https://wms.arisecraft.com/android-chrome-192x192.png';
        url = url ? url : process.env.WMS_BASE_URL;
        const notificationPayload = {
            title,
            body,
            icon,
            url,
        };

        try {
            const subscriptions = await this.getSubscriptions(data);
            console.log('subscriptionssss ' , subscriptions);
            
            subscriptions?.map((_: any) => {
                const subscription = {
                    endpoint: _.endpoint,
                    keys: {
                        p256dh: _.p256dh,
                        auth: _.auth,
                    },
                };
                webPush.sendNotification(
                    subscription,
                    JSON.stringify(notificationPayload)
                );
            }); 
        } catch (error) {
            console.log(error);
        }
        
    }
}

export default notificationModel;
