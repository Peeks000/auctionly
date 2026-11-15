-- ====================================================================
-- AUCTIONLY — MASTER DATABASE SCHEMA & SECURITY DEFINITIONS
-- Migration: 20261115000000_initial_schema.sql
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------------------
-- 1. ENUMS & DOMAINS
-- --------------------------------------------------------------------

CREATE TYPE user_role AS ENUM (
    'visitor',
    'buyer',
    'seller',
    'professional_auctioneer',
    'moderator',
    'verification_specialist',
    'customer_support',
    'finance_manager',
    'administrator',
    'super_admin'
);

CREATE TYPE verification_tier AS ENUM (
    'unverified', 
    'phone_verified', 
    'id_verified', 
    'enhanced_accredited'
);

CREATE TYPE listing_status AS ENUM (
    'draft', 
    'pending_review', 
    'approved', 
    'published', 
    'rejected', 
    'suspended', 
    'withdrawn', 
    'sold', 
    'archived'
);

CREATE TYPE inventory_state AS ENUM (
    'available', 
    'reserved_in_checkout', 
    'sold_auction', 
    'sold_buynow'
);

CREATE TYPE sale_format_type AS ENUM (
    'timed_auction', 
    'live_auction', 
    'buy_now', 
    'hybrid_auction_buynow'
);

CREATE TYPE auction_status AS ENUM (
    'scheduled', 
    'active', 
    'extended', 
    'closed_sold', 
    'closed_unsold', 
    'canceled'
);

CREATE TYPE order_payment_status AS ENUM (
    'pending', 
    'authorized', 
    'captured', 
    'failed', 
    'refunded', 
    'disputed'
);

CREATE TYPE settlement_payout_status AS ENUM (
    'accrued', 
    'held_in_dispute', 
    'approved', 
    'processed', 
    'failed'
);

-- --------------------------------------------------------------------
-- 2. CORE TABLES
-- --------------------------------------------------------------------

-- User Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'buyer',
    verification_status verification_tier NOT NULL DEFAULT 'unverified',
    avatar_url TEXT,
    bio TEXT,
    gstin TEXT,
    pan TEXT,
    billing_address JSONB DEFAULT '{}'::jsonb,
    shipping_address JSONB DEFAULT '{}'::jsonb,
    is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categories (7 Launch Categories)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    buyer_premium_pct NUMERIC(4,2) NOT NULL DEFAULT 12.00,
    seller_commission_pct NUMERIC(4,2) NOT NULL DEFAULT 8.00,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Listings
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    artist_or_maker TEXT,
    origin_period TEXT,
    dimensions JSONB DEFAULT '{}'::jsonb,
    materials TEXT[] DEFAULT '{}',
    condition_grade TEXT NOT NULL DEFAULT 'Excellent',
    condition_report TEXT,
    provenance_history TEXT,
    authenticity_status TEXT NOT NULL DEFAULT 'unverified',
    primary_image_url TEXT NOT NULL,
    gallery_image_urls TEXT[] NOT NULL DEFAULT '{}',
    model_3d_url TEXT,
    sale_format sale_format_type NOT NULL DEFAULT 'timed_auction',
    starting_price BIGINT NOT NULL,          -- In Paisa (INR * 100)
    reserve_price BIGINT,                    -- Private reserve in Paisa
    buy_now_price BIGINT,                    -- In Paisa
    estimate_low BIGINT,                     -- In Paisa
    estimate_high BIGINT,                    -- In Paisa
    status listing_status NOT NULL DEFAULT 'draft',
    inventory_status inventory_state NOT NULL DEFAULT 'available',
    checkout_reserved_until TIMESTAMPTZ,
    rejection_reason TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auctions
CREATE TABLE IF NOT EXISTS auctions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID UNIQUE NOT NULL REFERENCES listings(id) ON DELETE RESTRICT,
    status auction_status NOT NULL DEFAULT 'scheduled',
    starting_price BIGINT NOT NULL,
    reserve_price BIGINT,
    current_price BIGINT NOT NULL,
    min_increment BIGINT NOT NULL DEFAULT 50000, -- Default ₹500 increment (in paisa)
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    anti_snipe_trigger_minutes INT NOT NULL DEFAULT 3,
    anti_snipe_extension_minutes INT NOT NULL DEFAULT 2,
    extension_count INT NOT NULL DEFAULT 0,
    bid_count INT NOT NULL DEFAULT 0,
    winning_bidder_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    hammer_price BIGINT,
    reserve_met BOOLEAN NOT NULL DEFAULT FALSE,
    is_live BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bids
CREATE TABLE IF NOT EXISTS bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE RESTRICT,
    bidder_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    amount BIGINT NOT NULL,                  -- Displayed high bid in paisa
    max_amount BIGINT NOT NULL,              -- Secret proxy ceiling in paisa
    is_proxy BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bids_auction_max ON bids (auction_id, max_amount DESC, created_at ASC);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE RESTRICT,
    buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    hammer_or_sale_price BIGINT NOT NULL,    -- in Paisa
    buyer_premium BIGINT NOT NULL,           -- in Paisa
    tax_amount BIGINT NOT NULL,              -- GST in Paisa
    shipping_fee BIGINT NOT NULL DEFAULT 0,
    total_amount BIGINT NOT NULL,            -- in Paisa
    payment_status order_payment_status NOT NULL DEFAULT 'pending',
    razorpay_order_id TEXT UNIQUE,
    razorpay_payment_id TEXT UNIQUE,
    razorpay_signature TEXT,
    shipping_status TEXT NOT NULL DEFAULT 'unfulfilled',
    tracking_number TEXT,
    courier_partner TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    invoice_number TEXT UNIQUE NOT NULL,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    seller_gstin TEXT,
    buyer_gstin TEXT,
    taxable_value BIGINT NOT NULL,           -- in Paisa
    cgst_amount BIGINT NOT NULL DEFAULT 0,
    sgst_amount BIGINT NOT NULL DEFAULT 0,
    igst_amount BIGINT NOT NULL DEFAULT 0,
    total_amount BIGINT NOT NULL,
    pdf_storage_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seller Settlements
CREATE TABLE IF NOT EXISTS seller_settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    gross_amount BIGINT NOT NULL,            -- in Paisa
    commission_deducted BIGINT NOT NULL,     -- in Paisa
    tds_deducted BIGINT NOT NULL DEFAULT 0,  -- Indian TDS 194-O (1%)
    net_payout BIGINT NOT NULL,              -- in Paisa
    payout_status settlement_payout_status NOT NULL DEFAULT 'accrued',
    bank_account_last4 TEXT,
    payout_reference TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Disputes
CREATE TABLE IF NOT EXISTS disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    complainant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    respondent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    dispute_type TEXT NOT NULL,              -- damage, missing, authenticity, not_as_described
    status TEXT NOT NULL DEFAULT 'opened',   -- opened, under_review, resolved_refund, resolved_rejected
    evidence_urls TEXT[] DEFAULT '{}',
    complainant_statement TEXT NOT NULL,
    respondent_statement TEXT,
    admin_resolution_notes TEXT,
    refund_amount BIGINT DEFAULT 0,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    body TEXT NOT NULL,
    attachments TEXT[] DEFAULT '{}',
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,                      -- outbid, auction_won, order_update, verification
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Verification Requests
CREATE TABLE IF NOT EXISTS verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    request_type TEXT NOT NULL,              -- seller_id, business_pan, auctioneer_license
    document_urls TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'submitted', -- submitted, in_review, approved, rejected
    reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    review_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    target_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Super Admin Bootstrap Record
CREATE TABLE IF NOT EXISTS super_admin_bootstrap (
    id INT PRIMARY KEY DEFAULT 1,
    initialized BOOLEAN NOT NULL DEFAULT FALSE,
    initialized_at TIMESTAMPTZ,
    initialized_by TEXT,
    CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO super_admin_bootstrap (id, initialized) VALUES (1, FALSE) ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE super_admin_bootstrap ENABLE ROW LEVEL SECURITY;

-- Categories: Public read
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);

-- Profiles: Public read basic, self-update
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Listings: Published viewable by everyone; draft viewable by seller
CREATE POLICY "Published listings viewable by everyone" ON listings FOR SELECT USING (
    status = 'published' OR 
    auth.uid() = seller_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('administrator', 'super_admin', 'moderator'))
);

CREATE POLICY "Sellers can insert listings" ON listings FOR INSERT WITH CHECK (
    auth.uid() = seller_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('seller', 'administrator', 'super_admin'))
);

CREATE POLICY "Sellers can update own unapproved listings" ON listings FOR UPDATE USING (
    auth.uid() = seller_id AND status IN ('draft', 'rejected')
);

-- Auctions: Viewable by everyone
CREATE POLICY "Auctions are viewable by everyone" ON auctions FOR SELECT USING (true);

-- Bids: Viewable by everyone except max_amount is filtered
CREATE POLICY "Bids are viewable by everyone" ON bids FOR SELECT USING (true);

-- Orders: Viewable by buyer, seller, and staff
CREATE POLICY "Orders viewable by parties" ON orders FOR SELECT USING (
    auth.uid() = buyer_id OR 
    auth.uid() = seller_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('finance_manager', 'administrator', 'super_admin'))
);

-- Messages: Viewable by sender or recipient
CREATE POLICY "Messages viewable by participants" ON messages FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = recipient_id
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id
);

-- Notifications: Viewable by owner
CREATE POLICY "Notifications viewable by owner" ON notifications FOR SELECT USING (
    auth.uid() = user_id
);

-- --------------------------------------------------------------------
-- 4. CONCURRENCY-SAFE STORED PROCEDURES (RPC)
-- --------------------------------------------------------------------

-- Authoritative Atomic Bid Placement Function
CREATE OR REPLACE FUNCTION place_bid(
    p_auction_id UUID,
    p_bidder_id UUID,
    p_max_amount BIGINT
) RETURNS JSONB AS $$
DECLARE
    v_auction RECORD;
    v_highest_bid RECORD;
    v_new_current_price BIGINT;
    v_extension_window INTERVAL := INTERVAL '3 minutes';
    v_extension_duration INTERVAL := INTERVAL '2 minutes';
    v_reserve_met BOOLEAN;
BEGIN
    -- 1. Exclusively lock the auction row
    SELECT * INTO v_auction
    FROM auctions
    WHERE id = p_auction_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Auction not found.');
    END IF;

    -- 2. Validate authoritative server time & status
    IF v_auction.status NOT IN ('active', 'extended') OR NOW() >= v_auction.end_time THEN
        RETURN jsonb_build_object('success', false, 'error', 'Auction is not active or has expired.');
    END IF;

    -- 3. Check bidder is not the seller
    IF EXISTS (SELECT 1 FROM listings WHERE id = v_auction.listing_id AND seller_id = p_bidder_id) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Sellers cannot bid on their own consignments.');
    END IF;

    -- 4. Validate bid amount against increment
    IF p_max_amount < (v_auction.current_price + v_auction.min_increment) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Bid must be at least current price plus minimum increment.');
    END IF;

    -- 5. Query highest existing proxy bid
    SELECT * INTO v_highest_bid
    FROM bids
    WHERE auction_id = p_auction_id
    ORDER BY max_amount DESC, created_at ASC
    LIMIT 1;

    IF NOT FOUND THEN
        -- First bid: Price set to starting price
        v_new_current_price := v_auction.starting_price;
    ELSIF p_max_amount > v_highest_bid.max_amount THEN
        -- New bidder takes lead: Price advances to existing max + increment (or up to p_max_amount)
        v_new_current_price := LEAST(p_max_amount, v_highest_bid.max_amount + v_auction.min_increment);
    ELSE
        -- Existing proxy leader retains lead: Price advances
        v_new_current_price := LEAST(v_highest_bid.max_amount, p_max_amount + v_auction.min_increment);
        
        -- Insert losing bid record for audit trail
        INSERT INTO bids (auction_id, bidder_id, amount, max_amount, is_proxy, created_at)
        VALUES (p_auction_id, p_bidder_id, p_max_amount, p_max_amount, false, NOW());

        UPDATE auctions 
        SET current_price = v_new_current_price,
            bid_count = bid_count + 1
        WHERE id = p_auction_id;

        RETURN jsonb_build_object('success', false, 'status', 'outbid_immediately', 'current_price', v_new_current_price);
    END IF;

    -- 6. Insert winning bid
    INSERT INTO bids (auction_id, bidder_id, amount, max_amount, is_proxy, created_at)
    VALUES (p_auction_id, p_bidder_id, v_new_current_price, p_max_amount, true, NOW());

    -- Check reserve met
    v_reserve_met := (v_auction.reserve_price IS NULL OR v_new_current_price >= v_auction.reserve_price);

    -- 7. Anti-Sniping Check (Dynamic Extension)
    IF (v_auction.end_time - NOW()) <= v_extension_window THEN
        UPDATE auctions
        SET end_time = v_auction.end_time + v_extension_duration,
            status = 'extended',
            current_price = v_new_current_price,
            winning_bidder_id = p_bidder_id,
            reserve_met = v_reserve_met,
            bid_count = bid_count + 1,
            extension_count = extension_count + 1,
            updated_at = NOW()
        WHERE id = p_auction_id;
    ELSE
        UPDATE auctions
        SET current_price = v_new_current_price,
            winning_bidder_id = p_bidder_id,
            reserve_met = v_reserve_met,
            bid_count = bid_count + 1,
            updated_at = NOW()
        WHERE id = p_auction_id;
    END IF;

    RETURN jsonb_build_object(
        'success', true, 
        'current_price', v_new_current_price,
        'reserve_met', v_reserve_met,
        'new_end_time', (SELECT end_time FROM auctions WHERE id = p_auction_id)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic Buy Now & Dual-Sale Prevention Function
CREATE OR REPLACE FUNCTION execute_buy_now(
    p_listing_id UUID,
    p_buyer_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_listing RECORD;
    v_order_number TEXT;
    v_order_id UUID;
    v_buyer_premium BIGINT;
    v_tax_amount BIGINT;
    v_total_amount BIGINT;
    v_category RECORD;
BEGIN
    -- 1. Exclusively lock the listing row
    SELECT * INTO v_listing
    FROM listings
    WHERE id = p_listing_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Listing not found.');
    END IF;

    IF v_listing.inventory_status != 'available' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Listing is no longer available.');
    END IF;

    IF v_listing.buy_now_price IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Listing does not support Buy Now.');
    END IF;

    -- Retrieve category commission rates
    SELECT * INTO v_category FROM categories WHERE id = v_listing.category_id;

    -- Calculate financial amounts in Paisa
    -- Buyer premium: e.g. 12%
    v_buyer_premium := ROUND(v_listing.buy_now_price * (COALESCE(v_category.buyer_premium_pct, 12.0) / 100.0));
    -- GST: 18% on Buyer's Premium
    v_tax_amount := ROUND(v_buyer_premium * 0.18);
    v_total_amount := v_listing.buy_now_price + v_buyer_premium + v_tax_amount;

    v_order_number := 'AUC-BN-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTRING(gen_random_uuid()::text, 1, 6);

    -- 2. Mark inventory reserved
    UPDATE listings
    SET inventory_status = 'reserved_in_checkout',
        checkout_reserved_until = NOW() + INTERVAL '15 minutes'
    WHERE id = p_listing_id;

    -- 3. If there is an associated active auction, close or cancel it
    UPDATE auctions
    SET status = 'closed_sold',
        winning_bidder_id = p_buyer_id,
        hammer_price = v_listing.buy_now_price
    WHERE listing_id = p_listing_id;

    -- 4. Create pending order
    INSERT INTO orders (
        order_number, listing_id, buyer_id, seller_id,
        hammer_or_sale_price, buyer_premium, tax_amount, total_amount, payment_status
    ) VALUES (
        v_order_number, p_listing_id, p_buyer_id, v_listing.seller_id,
        v_listing.buy_now_price, v_buyer_premium, v_tax_amount, v_total_amount, 'pending'
    ) RETURNING id INTO v_order_id;

    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'total_amount', v_total_amount
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to Prevent Unauthorized Role Escalation
CREATE OR REPLACE FUNCTION prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role != OLD.role THEN
        -- Only Super Admin or server service role can alter roles
        IF auth.uid() IS NULL OR NOT EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'super_admin'
        ) THEN
            RAISE EXCEPTION 'Privilege escalation violation: Only Super Admin can modify user roles.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON profiles;
CREATE TRIGGER trg_prevent_role_escalation
BEFORE UPDATE OF role ON profiles
FOR EACH ROW
EXECUTE FUNCTION prevent_role_escalation();

-- --------------------------------------------------------------------
-- 5. INITIAL SEED TAXONOMY (THE 7 DEPARTMENTS)
-- --------------------------------------------------------------------

INSERT INTO categories (slug, name, description, buyer_premium_pct, seller_commission_pct, display_order)
VALUES
    ('fine-art', 'Fine Art & Paintings', 'Masterpiece oils, traditional miniatures, contemporary Indian canvases, and signed lithographs.', 12.00, 8.00, 1),
    ('sculptures', 'Sculptures & Decorative Art', 'Classical bronzes, carved marble, temple stone, ceramics, and architectural artifacts.', 12.00, 8.00, 2),
    ('antiques', 'Antiques & Historical Objects', 'Royal heirloom artifacts, Mughal weaponry, colonial silverware, and rare antiquities.', 15.00, 10.00, 3),
    ('numismatics', 'Coins, Stamps & Numismatics', 'Ancient Indian punch-marked coins, Mughal mohurs, British India rarities, and philatelic gems.', 10.00, 6.00, 4),
    ('watches-jewellery', 'Watches & Jewellery', 'Haute horlogerie, vintage chronographs, royal polki, natural pearls, and certified gemstones.', 12.00, 8.00, 5),
    ('rare-books', 'Rare Books & Manuscripts', 'First editions, illuminated folios, royal decrees, cartography, and ancient palm-leaf texts.', 10.00, 7.00, 6),
    ('vintage-design', 'Vintage Design & Furniture', 'Mid-century modernist furniture, Pierre Jeanneret Chandigarh pieces, and Art Deco masterworks.', 14.00, 9.00, 7)
ON CONFLICT (slug) DO NOTHING;
