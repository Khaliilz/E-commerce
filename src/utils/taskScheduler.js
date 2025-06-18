const { pool } = require('../db');

const basketExpiryTime =  2 * 60 * 60 * 1000;
const shipOrdersTime = 30 * 60 * 1000;

setInterval(async () => {
    await clearExpiredBaskets();
    await shipOrders();
}, 5 * 60 * 1000);

const clearExpiredBaskets = async () => {
    const now = Date.now();
    
    try {
        const expiryDate = new Date(now - basketExpiryTime);
        const { rows } = await pool.query(
            'SELECT id FROM users WHERE last_basket_edit < $1',
            [expiryDate]
        );

        if (rows.length > 0) {
            const userIds = rows.map(row => row.id);
            await pool.query(
                'DELETE FROM basket_products WHERE user_id = ANY($1)',
                [userIds]
            );
            console.log(`Cleared baskets for users: ${userIds.join(', ')}`);
        }
    } catch (error) {
        console.error('Error clearing expired baskets:', error);
        throw error;
    }
}

const shipOrders = async () => {
    const now = Date.now();
    
    try {
        const shipDate = new Date(now - shipOrdersTime);
        const { rows } = await pool.query(
            'SELECT id FROM orders WHERE status = $1 AND created_at < $2',
            ['pending', shipDate]
        );

        if (rows.length > 0) {
            const orderIds = rows.map(row => row.id);
            await pool.query(
                'UPDATE orders SET status = $1 WHERE id = ANY($2)',
                ['completed', orderIds]
            );
            console.log(`Shipped orders: ${orderIds.join(', ')}`);
        }
    } catch (error) {
        console.error('Error shipping orders:', error);
        throw error;
    }
}