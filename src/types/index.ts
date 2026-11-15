export type UserRole =
  | 'visitor'
  | 'buyer'
  | 'seller'
  | 'professional_auctioneer'
  | 'moderator'
  | 'verification_specialist'
  | 'customer_support'
  | 'finance_manager'
  | 'administrator'
  | 'super_admin';

export type VerificationTier =
  | 'unverified'
  | 'phone_verified'
  | 'id_verified'
  | 'enhanced_accredited';

export type ListingStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'published'
  | 'rejected'
  | 'suspended'
  | 'withdrawn'
  | 'sold'
  | 'archived';

export type InventoryState =
  | 'available'
  | 'reserved_in_checkout'
  | 'sold_auction'
  | 'sold_buynow';

export type SaleFormatType =
  | 'timed_auction'
  | 'live_auction'
  | 'buy_now'
  | 'hybrid_auction_buynow';

export type AuctionStatus =
  | 'scheduled'
  | 'active'
  | 'extended'
  | 'closed_sold'
  | 'closed_unsold'
  | 'canceled';

export type OrderPaymentStatus =
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'refunded'
  | 'disputed';

export type SettlementPayoutStatus =
  | 'accrued'
  | 'held_in_dispute'
  | 'approved'
  | 'processed'
  | 'failed';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  role: UserRole;
  verification_status: VerificationTier;
  avatar_url?: string | null;
  bio?: string | null;
  gstin?: string | null;
  pan?: string | null;
  billing_address?: Record<string, any>;
  shipping_address?: Record<string, any>;
  is_suspended: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  buyer_premium_pct: number;
  seller_commission_pct: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  category_id: string;
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  artist_or_maker?: string | null;
  origin_period?: string | null;
  dimensions?: {
    height?: number;
    width?: number;
    depth?: number;
    unit?: string;
  };
  materials: string[];
  condition_grade: string;
  condition_report?: string | null;
  provenance_history?: string | null;
  authenticity_status: 'verified' | 'unverified' | 'under_review' | 'disputed';
  primary_image_url: string;
  gallery_image_urls: string[];
  model_3d_url?: string | null;
  sale_format: SaleFormatType;
  starting_price: number; // in Paisa
  reserve_price?: number | null; // in Paisa (private)
  buy_now_price?: number | null; // in Paisa
  estimate_low?: number | null; // in Paisa
  estimate_high?: number | null; // in Paisa
  status: ListingStatus;
  inventory_status: InventoryState;
  checkout_reserved_until?: string | null;
  rejection_reason?: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Auction {
  id: string;
  listing_id: string;
  status: AuctionStatus;
  starting_price: number;
  reserve_price?: number | null;
  current_price: number;
  min_increment: number;
  start_time: string;
  end_time: string;
  anti_snipe_trigger_minutes: number;
  anti_snipe_extension_minutes: number;
  extension_count: number;
  bid_count: number;
  winning_bidder_id?: string | null;
  hammer_price?: number | null;
  reserve_met: boolean;
  is_live: boolean;
  created_at: string;
  updated_at: string;
  listing?: Listing;
}

export interface Bid {
  id: string;
  auction_id: string;
  bidder_id: string;
  amount: number; // in Paisa
  max_amount?: number; // in Paisa (secret proxy, only visible to owning bidder)
  is_proxy: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  hammer_or_sale_price: number;
  buyer_premium: number;
  tax_amount: number;
  shipping_fee: number;
  total_amount: number;
  payment_status: OrderPaymentStatus;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  shipping_status: string;
  tracking_number?: string | null;
  courier_partner?: string | null;
  created_at: string;
  updated_at: string;
  listing?: Listing;
}

export interface Invoice {
  id: string;
  order_id: string;
  invoice_number: string;
  invoice_date: string;
  seller_gstin?: string | null;
  buyer_gstin?: string | null;
  taxable_value: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total_amount: number;
  pdf_storage_path?: string | null;
  created_at: string;
}
