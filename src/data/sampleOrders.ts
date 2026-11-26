/**
 * Sample orders that always work on the status page while demo mode is on.
 * TEMPORARY: remove (or leave unused) once a real backend answers getOrderStatus().
 */
import type { RepairId } from './repairs';
import type { StatusId } from './statusSteps';

export type SampleOrder = {
  orderNumber: string;
  phoneLast4: string;
  modelName: string;
  repairs: RepairId[];
  status: StatusId;
  /** hours ago the order was received (the timeline is built relative to now) */
  receivedHoursAgo: number;
};

export const sampleOrders: SampleOrder[] = [
  { orderNumber: 'FX-1024', phoneLast4: '1234', modelName: 'iPhone 15 Pro', repairs: ['screen'], status: 'repairing', receivedHoursAgo: 3 },
  { orderNumber: 'FX-1031', phoneLast4: '2345', modelName: 'Galaxy S24', repairs: ['battery', 'charging'], status: 'awaitingApproval', receivedHoursAgo: 2 },
  { orderNumber: 'FX-1042', phoneLast4: '3456', modelName: 'Pixel 9 Pro', repairs: ['backGlass'], status: 'awaitingPart', receivedHoursAgo: 26 },
  { orderNumber: 'FX-1057', phoneLast4: '4567', modelName: 'Redmi Note 14', repairs: ['water'], status: 'ready', receivedHoursAgo: 30 },
  { orderNumber: 'FX-1063', phoneLast4: '5678', modelName: 'iPhone 13', repairs: ['battery'], status: 'delivered', receivedHoursAgo: 52 },
];
