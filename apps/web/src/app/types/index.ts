export interface UserProfile {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  locale: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntitySummary {
  id: string;
  displayName: string;
  taxStatus: string;
  timezone: string;
  annualThreshold: number;
}

export interface AuthResponse {
  user: UserProfile;
  accessToken: string;
}

export interface ProfileResponse {
  user: UserProfile;
}

export interface EntityRequest {
  displayName: string;
  taxStatus?: string;
  regimeFrom?: string;
  annualThreshold?: number;
  iban?: string;
  bankName?: string;
  taxId?: string;
  address?: string;
  timezone?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
  total: string;
}

export interface Payment {
  id: string;
  amount: string;
  date: string;
  method: string;
  reference?: string | null;
}

export interface Invoice {
  id: string;
  entityId: string;
  number: string;
  issueDate: string;
  dueDate?: string | null;
  subtotal: string;
  tax: string;
  total: string;
  status: string;
  items: InvoiceItem[];
  payments: Payment[];
}

export interface Expense {
  id: string;
  entityId: string;
  date: string;
  amount: string;
  currency: string;
  description?: string | null;
  categoryId?: string | null;
}

export interface Reminder {
  id: string;
  type: string;
  dueDate: string;
  channel: string;
  sentAt?: string | null;
}

export interface TaxPeriod {
  id: string;
  entityId: string;
  periodStart: string;
  periodEnd: string;
  turnover: string;
  taxRate: string;
  taxDue: string;
  paid: boolean;
  paidAt?: string | null;
}

export interface BankTransaction {
  id: string;
  entityId: string;
  date: string;
  amount: string;
  description: string;
  counterparty?: string | null;
  categoryId?: string | null;
  linkedInvoiceId?: string | null;
}

export interface AuditLog {
  id: string;
  entityId: string;
  userId: string;
  action: string;
  details: Record<string, unknown>;
  createdAt: string;
}
