const { pool } = require('../db');

const shipOrdersTime = 30 * 60 * 1000;

setInterval(async () => {
    await shipOrders();
}, 5 * 60 * 1000);

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