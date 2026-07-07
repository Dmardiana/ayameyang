/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import pg from 'pg';

const { Pool } = pg;

// Create PostgreSQL connection pool from DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://dmardiana:@localhost:5432/ayameyang_db',
});

// Test connection on startup
pool.query('SELECT NOW()')
  .then(() => console.log('✅ PostgreSQL connected to ayameyang_db'))
  .catch((err) => console.error('❌ PostgreSQL connection error:', err.message));

export { pool };

// ============================================
// Helper Query Functions
// ============================================

export const db = {
  // --- USERS ---
  async getUsers() {
    const { rows } = await pool.query(
      'SELECT id, email, name, role, phone, address, created_at FROM users ORDER BY created_at'
    );
    return rows.map(mapUser);
  },

  async getUserByEmail(email: string) {
    const { rows } = await pool.query(
      'SELECT id, email, name, role, phone, address, password_hash, created_at FROM users WHERE email = $1',
      [email]
    );
    return rows[0] || null;
  },

  async createUser(user: { id: string; email: string; name: string; role: string; phone: string; address: string; passwordHash: string }) {
    const { rows } = await pool.query(
      `INSERT INTO users (id, email, name, role, phone, address, password_hash) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, email, name, role, phone, address, created_at`,
      [user.id, user.email, user.name, user.role, user.phone, user.address, user.passwordHash]
    );
    return mapUser(rows[0]);
  },

  // --- MENU ITEMS ---
  async getMenuItems() {
    const { rows } = await pool.query('SELECT * FROM menu_items ORDER BY sold_count DESC');
    return rows.map(mapMenuItem);
  },

  async createMenuItem(item: any) {
    const { rows } = await pool.query(
      `INSERT INTO menu_items (id, name, description, price, category, image, is_available, rating, sold_count) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [item.id, item.name, item.description, item.price, item.category, item.image, item.isAvailable ?? true, item.rating ?? 5.0, item.soldCount ?? 0]
    );
    return mapMenuItem(rows[0]);
  },

  async updateMenuItem(id: string, data: any) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.name !== undefined) { fields.push(`name = $${idx++}`); values.push(data.name); }
    if (data.description !== undefined) { fields.push(`description = $${idx++}`); values.push(data.description); }
    if (data.price !== undefined) { fields.push(`price = $${idx++}`); values.push(data.price); }
    if (data.category !== undefined) { fields.push(`category = $${idx++}`); values.push(data.category); }
    if (data.image !== undefined) { fields.push(`image = $${idx++}`); values.push(data.image); }
    if (data.isAvailable !== undefined) { fields.push(`is_available = $${idx++}`); values.push(data.isAvailable); }
    if (data.rating !== undefined) { fields.push(`rating = $${idx++}`); values.push(data.rating); }
    if (data.soldCount !== undefined) { fields.push(`sold_count = $${idx++}`); values.push(data.soldCount); }

    if (fields.length === 0) return null;

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE menu_items SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0] ? mapMenuItem(rows[0]) : null;
  },

  async deleteMenuItem(id: string) {
    const { rows } = await pool.query('DELETE FROM menu_items WHERE id = $1 RETURNING *', [id]);
    return rows[0] ? mapMenuItem(rows[0]) : null;
  },

  async incrementSoldCount(menuItemId: string, qty: number) {
    await pool.query('UPDATE menu_items SET sold_count = sold_count + $1 WHERE id = $2', [qty, menuItemId]);
  },

  // --- PROMOS ---
  async getPromos() {
    const { rows } = await pool.query('SELECT * FROM promos ORDER BY id');
    return rows.map(mapPromo);
  },

  async createPromo(promo: any) {
    const { rows } = await pool.query(
      `INSERT INTO promos (id, title, description, code, discount_percent, banner_url, is_available, min_purchase) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [promo.id, promo.title, promo.description, promo.code, promo.discountPercent, promo.bannerUrl, promo.isAvailable ?? true, promo.minPurchase ?? 0]
    );
    return mapPromo(rows[0]);
  },

  async updatePromo(id: string, data: any) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.title !== undefined) { fields.push(`title = $${idx++}`); values.push(data.title); }
    if (data.description !== undefined) { fields.push(`description = $${idx++}`); values.push(data.description); }
    if (data.code !== undefined) { fields.push(`code = $${idx++}`); values.push(data.code); }
    if (data.discountPercent !== undefined) { fields.push(`discount_percent = $${idx++}`); values.push(data.discountPercent); }
    if (data.bannerUrl !== undefined) { fields.push(`banner_url = $${idx++}`); values.push(data.bannerUrl); }
    if (data.isAvailable !== undefined) { fields.push(`is_available = $${idx++}`); values.push(data.isAvailable); }
    if (data.minPurchase !== undefined) { fields.push(`min_purchase = $${idx++}`); values.push(data.minPurchase); }

    if (fields.length === 0) return null;
    values.push(id);
    const { rows } = await pool.query(`UPDATE promos SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    return rows[0] ? mapPromo(rows[0]) : null;
  },

  async deletePromo(id: string) {
    const { rows } = await pool.query('DELETE FROM promos WHERE id = $1 RETURNING *', [id]);
    return rows[0] ? mapPromo(rows[0]) : null;
  },

  // --- BRANCHES ---
  async getBranches() {
    const { rows } = await pool.query('SELECT * FROM branches ORDER BY is_main_branch DESC, id');
    return rows.map(mapBranch);
  },

  async createBranch(branch: any) {
    const { rows } = await pool.query(
      `INSERT INTO branches (id, name, address, phone, lat, lng, is_main_branch, coming_soon) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [branch.id, branch.name, branch.address, branch.phone, branch.lat, branch.lng, branch.isMainBranch ?? false, branch.comingSoon ?? false]
    );
    return mapBranch(rows[0]);
  },

  async updateBranch(id: string, data: any) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.name !== undefined) { fields.push(`name = $${idx++}`); values.push(data.name); }
    if (data.address !== undefined) { fields.push(`address = $${idx++}`); values.push(data.address); }
    if (data.phone !== undefined) { fields.push(`phone = $${idx++}`); values.push(data.phone); }
    if (data.lat !== undefined) { fields.push(`lat = $${idx++}`); values.push(data.lat); }
    if (data.lng !== undefined) { fields.push(`lng = $${idx++}`); values.push(data.lng); }
    if (data.isMainBranch !== undefined) { fields.push(`is_main_branch = $${idx++}`); values.push(data.isMainBranch); }
    if (data.comingSoon !== undefined) { fields.push(`coming_soon = $${idx++}`); values.push(data.comingSoon); }

    if (fields.length === 0) return null;
    values.push(id);
    const { rows } = await pool.query(`UPDATE branches SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    return rows[0] ? mapBranch(rows[0]) : null;
  },

  async deleteBranch(id: string) {
    const { rows } = await pool.query('DELETE FROM branches WHERE id = $1 RETURNING *', [id]);
    return rows[0] ? mapBranch(rows[0]) : null;
  },

  // --- REVIEWS ---
  async getReviews() {
    const { rows } = await pool.query('SELECT * FROM reviews ORDER BY date DESC');
    return rows.map(mapReview);
  },

  async createReview(review: any) {
    const { rows } = await pool.query(
      `INSERT INTO reviews (id, customer_name, rating, comment, menu_id, menu_name, date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [review.id, review.customerName, review.rating, review.comment, review.menuId, review.menuName, review.date]
    );
    return mapReview(rows[0]);
  },

  async getReviewsByMenuId(menuId: string) {
    const { rows } = await pool.query('SELECT * FROM reviews WHERE menu_id = $1 ORDER BY date DESC', [menuId]);
    return rows.map(mapReview);
  },

  async recalcMenuRating(menuId: string) {
    const { rows } = await pool.query(
      'SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 5.0) as avg_rating FROM reviews WHERE menu_id = $1',
      [menuId]
    );
    const avgRating = parseFloat(rows[0].avg_rating);
    await pool.query('UPDATE menu_items SET rating = $1 WHERE id = $2', [avgRating, menuId]);
  },

  // --- RESERVATIONS ---
  async getReservations() {
    const { rows } = await pool.query('SELECT * FROM reservations ORDER BY created_at DESC');
    return rows.map(mapReservation);
  },

  async createReservation(res: any) {
    const { rows } = await pool.query(
      `INSERT INTO reservations (id, user_id, customer_name, customer_email, customer_phone, date, time, number_of_guests, table_number, status, special_requests) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [res.id, res.userId || null, res.customerName, res.customerEmail, res.customerPhone, res.date, res.time, res.numberOfGuests, res.tableNumber || null, res.status || 'pending', res.specialRequests || null]
    );
    return mapReservation(rows[0]);
  },

  async updateReservation(id: string, data: any) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.status !== undefined) { fields.push(`status = $${idx++}`); values.push(data.status); }
    if (data.tableNumber !== undefined) { fields.push(`table_number = $${idx++}`); values.push(data.tableNumber); }

    if (fields.length === 0) return null;
    values.push(id);
    const { rows } = await pool.query(`UPDATE reservations SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    return rows[0] ? mapReservation(rows[0]) : null;
  },

  // --- ORDERS ---
  async getOrders() {
    const { rows: orderRows } = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    const orders = [];
    for (const row of orderRows) {
      const { rows: itemRows } = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [row.id]);
      orders.push(mapOrder(row, itemRows));
    }
    return orders;
  },

  async createOrder(order: any) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const { rows } = await client.query(
        `INSERT INTO orders (id, user_id, customer_name, customer_email, customer_phone, total_amount, status, payment_method, table_number, notes, delivery_address) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [order.id, order.userId || null, order.customerName, order.customerEmail, order.customerPhone, order.totalAmount, order.status || 'pending', order.paymentMethod, order.tableNumber || null, order.notes || null, order.deliveryAddress || null]
      );
      
      const orderRow = rows[0];
      const itemRows = [];
      
      for (const item of order.items) {
        const { rows: insertedItems } = await client.query(
          `INSERT INTO order_items (order_id, menu_item_id, name, price, quantity, image) 
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          [order.id, item.menuItemId, item.name, item.price, item.quantity, item.image]
        );
        itemRows.push(insertedItems[0]);
        
        // Update sold count for menu item
        await client.query('UPDATE menu_items SET sold_count = sold_count + $1 WHERE id = $2', [item.quantity, item.menuItemId]);
      }
      
      await client.query('COMMIT');
      return mapOrder(orderRow, itemRows);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async updateOrder(id: string, data: any) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.status !== undefined) { fields.push(`status = $${idx++}`); values.push(data.status); }

    if (fields.length === 0) return null;
    values.push(id);
    const { rows } = await pool.query(`UPDATE orders SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    if (!rows[0]) return null;
    
    const { rows: itemRows } = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [id]);
    return mapOrder(rows[0], itemRows);
  },

  // --- CONTACT MESSAGES ---
  async getContactMessages() {
    const { rows } = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    return rows.map(mapContactMessage);
  },

  async createContactMessage(msg: any) {
    const { rows } = await pool.query(
      `INSERT INTO contact_messages (id, name, email, subject, message, status) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [msg.id, msg.name, msg.email, msg.subject, msg.message, msg.status || 'unread']
    );
    return mapContactMessage(rows[0]);
  },

  async updateContactMessage(id: string, data: any) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.status !== undefined) { fields.push(`status = $${idx++}`); values.push(data.status); }

    if (fields.length === 0) return null;
    values.push(id);
    const { rows } = await pool.query(`UPDATE contact_messages SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    return rows[0] ? mapContactMessage(rows[0]) : null;
  },

  // --- REPORTS (aggregated queries) ---
  async getReports() {
    // 1. Summary stats
    const { rows: [summaryRow] } = await pool.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END), 0) as total_sales,
        COUNT(*) as order_count,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_order_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders_count
      FROM orders
    `);

    const { rows: [resCountRow] } = await pool.query(
      "SELECT COUNT(*) as count FROM reservations WHERE status = 'confirmed'"
    );

    const { rows: [menuCountRow] } = await pool.query('SELECT COUNT(*) as count FROM menu_items');

    // 2. Category revenue
    const { rows: catRows } = await pool.query(`
      SELECT mi.category, COALESCE(SUM(oi.price * oi.quantity), 0) as revenue
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      LEFT JOIN menu_items mi ON mi.id = oi.menu_item_id
      WHERE o.status = 'completed'
      GROUP BY mi.category
    `);
    const categoryRevenue: Record<string, number> = { makanan: 0, minuman: 0, dessert: 0 };
    catRows.forEach((r: any) => {
      if (r.category && categoryRevenue.hasOwnProperty(r.category)) {
        categoryRevenue[r.category] = parseInt(r.revenue);
      }
    });

    // 3. Daily sales
    const { rows: dailyRows } = await pool.query(`
      SELECT DATE(created_at) as date, SUM(total_amount) as amount
      FROM orders WHERE status = 'completed'
      GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 10
    `);

    // 4. Best sellers
    const { rows: bestRows } = await pool.query(`
      SELECT name, sold_count as sold, sold_count * price as revenue, image
      FROM menu_items ORDER BY sold_count DESC LIMIT 5
    `);

    return {
      summary: {
        totalSales: parseInt(summaryRow.total_sales),
        orderCount: parseInt(summaryRow.order_count),
        completedOrderCount: parseInt(summaryRow.completed_order_count),
        activeReservationsCount: parseInt(resCountRow.count),
        pendingOrdersCount: parseInt(summaryRow.pending_orders_count),
        menuCount: parseInt(menuCountRow.count),
      },
      categoryRevenue,
      dailySales: dailyRows.map((r: any) => ({ date: r.date.toISOString().split('T')[0], amount: parseInt(r.amount) })).reverse(),
      bestSellers: bestRows.map((r: any) => ({ name: r.name, sold: parseInt(r.sold), revenue: parseInt(r.revenue), image: r.image }))
    };
  }
};

// ============================================
// Row Mappers: snake_case DB → camelCase App
// ============================================

function mapUser(row: any) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    phone: row.phone || '',
    address: row.address || '',
    createdAt: row.created_at?.toISOString?.() || row.created_at || ''
  };
}

function mapMenuItem(row: any) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: parseInt(row.price),
    category: row.category,
    image: row.image,
    isAvailable: row.is_available,
    rating: parseFloat(row.rating),
    soldCount: parseInt(row.sold_count)
  };
}

function mapPromo(row: any) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    code: row.code,
    discountPercent: parseInt(row.discount_percent),
    bannerUrl: row.banner_url,
    isAvailable: row.is_available,
    minPurchase: parseInt(row.min_purchase)
  };
}

function mapBranch(row: any) {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    phone: row.phone,
    lat: parseFloat(row.lat),
    lng: parseFloat(row.lng),
    isMainBranch: row.is_main_branch,
    comingSoon: row.coming_soon
  };
}

function mapReview(row: any) {
  return {
    id: row.id,
    customerName: row.customer_name,
    rating: parseInt(row.rating),
    comment: row.comment,
    menuId: row.menu_id,
    menuName: row.menu_name,
    date: row.date
  };
}

function mapReservation(row: any) {
  return {
    id: row.id,
    userId: row.user_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    date: row.date,
    time: row.time,
    numberOfGuests: parseInt(row.number_of_guests),
    tableNumber: row.table_number,
    status: row.status,
    specialRequests: row.special_requests,
    createdAt: row.created_at?.toISOString?.() || row.created_at || ''
  };
}

function mapOrder(row: any, itemRows: any[]) {
  return {
    id: row.id,
    userId: row.user_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    items: itemRows.map(ir => ({
      menuItemId: ir.menu_item_id,
      name: ir.name,
      price: parseInt(ir.price),
      quantity: parseInt(ir.quantity),
      image: ir.image
    })),
    totalAmount: parseInt(row.total_amount),
    status: row.status,
    paymentMethod: row.payment_method,
    tableNumber: row.table_number,
    notes: row.notes,
    deliveryAddress: row.delivery_address,
    createdAt: row.created_at?.toISOString?.() || row.created_at || ''
  };
}

function mapContactMessage(row: any) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    status: row.status,
    createdAt: row.created_at?.toISOString?.() || row.created_at || ''
  };
}
