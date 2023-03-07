import { OrderStatus } from './order-status';
import { Ticket } from './ticket';

type BaseOrder = {
  id: string;
  userId: string;
  status: OrderStatus;
  expiresAt: Date | string;
  version: number;
};

export type Order = BaseOrder & { ticket: string };

export type PopulatedOrder = BaseOrder & { ticket: Ticket };
