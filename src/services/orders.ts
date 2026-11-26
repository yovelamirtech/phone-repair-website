/**
 * Order & contact "backend".
 *
 * DEMO MODE: everything is stored in the visitor's browser (localStorage) after a fake 1s delay.
 * To go live, replace ONLY the bodies of submitOrder(), getOrderStatus() and submitContactMessage()
 * (e.g. POST to Formspree / a Google Apps Script web app / your own API). No component changes needed.
 */
import type { PartQuality, RepairId } from '../data/repairs';
import { sampleOrders } from '../data/sampleOrders';
import { statusSteps, statusIndex, type StatusId } from '../data/statusSteps';
import { generateOrderNumber } from '../features/order/orderNumber';
import { readJson, storageKeys, writeJson } from '../lib/storage';

export type OrderInput = {
  brandId: string;
  modelId: string | null;
  /** display name of the device (model name, or the free text for "other") */
  deviceName: string;
  repairs: { repairId: RepairId; quality?: PartQuality }[];
  estimate: { total: number; startingFrom: boolean; free: boolean } | null;
  appointment: { date: string; time: string };
  customer: { name: string; phone: string; email?: string; notes?: string };
  consents: { privacy: boolean; backup: boolean };
};

export type StoredOrder = OrderInput & { orderNumber: string; createdAt: string };

export type OrderStatus = {
  orderNumber: string;
  deviceName: string;
  repairs: RepairId[];
  current: StatusId;
  /** steps reached so far, with the time each was reached */
  history: { id: StatusId; at: string }[];
  appointment?: { date: string; time: string };
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const phoneDigits = (p: string) => p.replace(/\D/g, '');

function storedOrders(): StoredOrder[] {
  return readJson<StoredOrder[]>(storageKeys.orders, []);
}

export async function submitOrder(input: OrderInput): Promise<{ orderNumber: string }> {
  await delay(1000);
  const orders = storedOrders();
  const orderNumber = generateOrderNumber([...orders.map((o) => o.orderNumber), ...sampleOrders.map((o) => o.orderNumber)]);
  orders.push({ ...input, orderNumber, createdAt: new Date().toISOString() });
  writeJson(storageKeys.orders, orders);
  return { orderNumber };
}

/** Demo: an order created on this browser moves one status forward every 3 minutes. */
export const DEMO_STEP_MINUTES = 3;

function buildHistory(receivedAt: number, reached: number, stepMs: number): OrderStatus['history'] {
  return statusSteps.slice(0, reached + 1).map((s, i) => ({ id: s.id, at: new Date(receivedAt + i * stepMs).toISOString() }));
}

/**
 * Looks up an order by number + last 4 digits of the phone.
 * Returns null both when the order doesn't exist and when the digits don't match,
 * so the page can't reveal which order numbers exist.
 */
export async function getOrderStatus(orderNumber: string, phoneLast4: string, now: Date = new Date()): Promise<OrderStatus | null> {
  await delay(600);

  const sample = sampleOrders.find((o) => o.orderNumber === orderNumber);
  if (sample) {
    if (sample.phoneLast4 !== phoneLast4) return null;
    const reached = statusIndex(sample.status);
    const receivedAt = now.getTime() - sample.receivedHoursAgo * 3600_000;
    const stepMs = (sample.receivedHoursAgo * 3600_000) / (reached + 1);
    return {
      orderNumber,
      deviceName: sample.modelName,
      repairs: sample.repairs,
      current: sample.status,
      history: buildHistory(receivedAt, reached, stepMs),
    };
  }

  const order = storedOrders().find((o) => o.orderNumber === orderNumber);
  if (!order || phoneDigits(order.customer.phone).slice(-4) !== phoneLast4) return null;
  const createdAt = new Date(order.createdAt).getTime();
  const stepMs = DEMO_STEP_MINUTES * 60_000;
  const reached = Math.min(statusSteps.length - 1, Math.max(0, Math.floor((now.getTime() - createdAt) / stepMs)));
  return {
    orderNumber,
    deviceName: order.deviceName,
    repairs: order.repairs.map((r) => r.repairId),
    current: statusSteps[reached]!.id,
    history: buildHistory(createdAt, reached, stepMs),
    appointment: order.appointment,
  };
}

export type ContactInput = { name: string; phone: string; email?: string; message: string };

export async function submitContactMessage(input: ContactInput): Promise<void> {
  await delay(1000);
  const list = readJson<(ContactInput & { at: string })[]>(storageKeys.contactMessages, []);
  list.push({ ...input, at: new Date().toISOString() });
  writeJson(storageKeys.contactMessages, list);
}
