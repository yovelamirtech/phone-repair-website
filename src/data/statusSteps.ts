import { ClipboardCheck, PackageCheck, ScanSearch, Truck, UserCheck, Wrench, CircleCheck, type LucideIcon } from 'lucide-react';

export type StatusId = 'received' | 'diagnosing' | 'awaitingApproval' | 'awaitingPart' | 'repairing' | 'ready' | 'delivered';

/** Order status steps, in order. Labels come from status:steps.<id>. */
export const statusSteps: { id: StatusId; icon: LucideIcon }[] = [
  { id: 'received', icon: ClipboardCheck },
  { id: 'diagnosing', icon: ScanSearch },
  { id: 'awaitingApproval', icon: UserCheck },
  { id: 'awaitingPart', icon: Truck },
  { id: 'repairing', icon: Wrench },
  { id: 'ready', icon: PackageCheck },
  { id: 'delivered', icon: CircleCheck },
];

export const statusIndex = (id: StatusId) => statusSteps.findIndex((s) => s.id === id);
