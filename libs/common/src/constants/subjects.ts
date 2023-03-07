export enum Subjects {
  LoginUser = 'user:login',
  LogoutUser = 'user:logout',
  RegisterUser = 'user:register',

  RefreshToken = 'token:refresh',
  ValidateToken = 'token:validate',

  TicketCreated = 'ticket:created',
  TicketUpdated = 'ticket:updated',

  OrderCreated = 'order:created',
  OrderCancelled = 'order:cancelled',

  ExpirationComplete = 'expiration:complete',

  PaymentCreated = 'payment:created',
}
