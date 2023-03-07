import { PopulatedOrder } from './order';
import { Ticket } from './ticket';

export type TicketCreatedEvent = Ticket;

export type TicketUpdatedEvent = Ticket;

export type OrderCreatedEvent = PopulatedOrder;

export type OrderCancelledEvent = PopulatedOrder;
export interface ExpirationCompleteEvent {
  orderId: string;
}

export interface PaymentCreatedEvent {
  id: string;
  orderId: string;
  stripeId: string;
}
