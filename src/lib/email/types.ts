export type WelcomeEmailData = {
  firstName: string;
};

export type OrderEmailItem = {
  title: string;
  quantity: number;
  unitPrice: string; // formatted
  amount: string; // formatted
};

export type OrderConfirmationEmailData = {
  firstName: string;
  orderNumber: string;
  orderDate: string;
  items: OrderEmailItem[];
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  currency: string;
  paymentStatus: string;
  orderStatus: string;
};

export type EmailRenderResult = {
  subject: string;
  html: string;
  text: string;
};

export type SendResult = {
  notificationType: 'welcome' | 'order_confirmation';
  reference: string;
  messageId: string | null;
  accepted: boolean;
  error: string | null;
  timestamp: string;
};