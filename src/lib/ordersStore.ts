import fs from "fs";
import path from "path";

export interface StoredOrder {
  orderNumber: string;
  razorpayOrderId: string;
  listingId: string;
  buyerId: string;
  amountPaisa: number;
  hammerPricePaisa: number;
  buyerPremiumPaisa: number;
  taxPaisa: number;
  status: "pending" | "captured" | "failed";
  isDemo: boolean;
  createdAt: string;
  capturedAt?: string;
  paymentId?: string;
  invoiceNumber?: string;
}

// In-memory fallback cache backed by persistent file store
const memoryOrders = new Map<string, StoredOrder>();
const memoryWebhooks = new Set<string>();

const STORE_PATH = path.join(process.cwd(), ".planning", "orders_store.json");

function loadStore() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
      if (data.orders) {
        for (const ord of data.orders) {
          memoryOrders.set(ord.orderNumber, ord);
          memoryOrders.set(ord.razorpayOrderId, ord);
        }
      }
      if (data.webhooks) {
        for (const id of data.webhooks) {
          memoryWebhooks.add(id);
        }
      }
    }
  } catch {
    // Ignore file read error in restricted environments
  }
}

function saveStore() {
  try {
    const ordersArray = Array.from(new Set(Array.from(memoryOrders.values())));
    const webhooksArray = Array.from(memoryWebhooks);
    fs.writeFileSync(STORE_PATH, JSON.stringify({ orders: ordersArray, webhooks: webhooksArray }, null, 2));
  } catch {
    // Ignore file write error in restricted environments
  }
}

// Initialize on load
loadStore();

export function saveOrder(order: StoredOrder): void {
  memoryOrders.set(order.orderNumber, order);
  memoryOrders.set(order.razorpayOrderId, order);
  saveStore();
}

export function getOrderByRazorpayId(razorpayOrderId: string): StoredOrder | undefined {
  return memoryOrders.get(razorpayOrderId);
}

export function getOrderByNumber(orderNumber: string): StoredOrder | undefined {
  return memoryOrders.get(orderNumber);
}

export function updateOrderStatus(
  orderIdentifier: string,
  updates: Partial<StoredOrder>
): StoredOrder | undefined {
  const existing = memoryOrders.get(orderIdentifier);
  if (!existing) return undefined;

  const updated: StoredOrder = { ...existing, ...updates };
  memoryOrders.set(updated.orderNumber, updated);
  memoryOrders.set(updated.razorpayOrderId, updated);
  saveStore();
  return updated;
}

export function recordWebhookEvent(eventId: string): boolean {
  if (memoryWebhooks.has(eventId)) {
    return false; // Already processed
  }
  memoryWebhooks.add(eventId);
  saveStore();
  return true; // Successfully recorded
}

export function isWebhookProcessed(eventId: string): boolean {
  return memoryWebhooks.has(eventId);
}
