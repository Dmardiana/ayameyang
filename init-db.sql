-- ============================================
-- AyamEyang Restaurant Database Schema
-- PostgreSQL 15+
-- ============================================

-- Drop existing tables if they exist (for clean re-init)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS promos CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- 1. USERS
-- ============================================
CREATE TABLE users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  phone         TEXT DEFAULT '',
  address       TEXT DEFAULT '',
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 2. MENU ITEMS
-- ============================================
CREATE TABLE menu_items (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  price        INTEGER NOT NULL DEFAULT 0,
  category     TEXT NOT NULL DEFAULT 'makanan' CHECK (category IN ('makanan', 'minuman', 'dessert')),
  image        TEXT NOT NULL DEFAULT '',
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  rating       NUMERIC(3,1) NOT NULL DEFAULT 5.0,
  sold_count   INTEGER NOT NULL DEFAULT 0
);

-- ============================================
-- 3. PROMOS
-- ============================================
CREATE TABLE promos (
  id               TEXT PRIMARY KEY,
  title            TEXT NOT NULL,
  description      TEXT NOT NULL DEFAULT '',
  code             TEXT NOT NULL,
  discount_percent INTEGER NOT NULL DEFAULT 0,
  banner_url       TEXT NOT NULL DEFAULT '',
  is_available     BOOLEAN NOT NULL DEFAULT TRUE,
  min_purchase     INTEGER NOT NULL DEFAULT 0
);

-- ============================================
-- 4. BRANCHES
-- ============================================
CREATE TABLE branches (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  address        TEXT NOT NULL DEFAULT '',
  phone          TEXT NOT NULL DEFAULT '',
  lat            NUMERIC(10,6) NOT NULL DEFAULT 0,
  lng            NUMERIC(10,6) NOT NULL DEFAULT 0,
  is_main_branch BOOLEAN NOT NULL DEFAULT FALSE,
  coming_soon    BOOLEAN NOT NULL DEFAULT FALSE
);

-- ============================================
-- 5. REVIEWS
-- ============================================
CREATE TABLE reviews (
  id            TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  rating        INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment       TEXT NOT NULL DEFAULT '',
  menu_id       TEXT REFERENCES menu_items(id) ON DELETE SET NULL,
  menu_name     TEXT NOT NULL DEFAULT '',
  date          TEXT NOT NULL DEFAULT ''
);

-- ============================================
-- 6. RESERVATIONS
-- ============================================
CREATE TABLE reservations (
  id               TEXT PRIMARY KEY,
  user_id          TEXT REFERENCES users(id) ON DELETE SET NULL,
  customer_name    TEXT NOT NULL,
  customer_email   TEXT NOT NULL,
  customer_phone   TEXT NOT NULL,
  date             TEXT NOT NULL,
  time             TEXT NOT NULL,
  number_of_guests INTEGER NOT NULL DEFAULT 2,
  table_number     TEXT,
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  special_requests TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 7. ORDERS
-- ============================================
CREATE TABLE orders (
  id               TEXT PRIMARY KEY,
  user_id          TEXT REFERENCES users(id) ON DELETE SET NULL,
  customer_name    TEXT NOT NULL,
  customer_email   TEXT NOT NULL,
  customer_phone   TEXT NOT NULL,
  total_amount     INTEGER NOT NULL DEFAULT 0,
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'cooking', 'delivering', 'completed', 'cancelled')),
  payment_method   TEXT NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'transfer', 'midtrans')),
  table_number     TEXT,
  notes            TEXT,
  delivery_address TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 8. ORDER ITEMS (child of orders)
-- ============================================
CREATE TABLE order_items (
  id           SERIAL PRIMARY KEY,
  order_id     TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id TEXT REFERENCES menu_items(id) ON DELETE SET NULL,
  name         TEXT NOT NULL,
  price        INTEGER NOT NULL DEFAULT 0,
  quantity     INTEGER NOT NULL DEFAULT 1,
  image        TEXT NOT NULL DEFAULT ''
);

-- ============================================
-- 9. CONTACT MESSAGES
-- ============================================
CREATE TABLE contact_messages (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT NOT NULL DEFAULT '',
  message    TEXT NOT NULL DEFAULT '',
  status     TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_customer_email ON reservations(customer_email);
CREATE INDEX idx_reviews_menu_id ON reviews(menu_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
