export type PaymentMethod =  'Delivery' | 'Vodafone-Cash' | 'Instapay' | 'Visa' | 'MasterCard' | 'PayPal';

export interface PaymentType {
    id: number;
    label: string;
    icon?: string;
    image?: string;
    paymentMethod: PaymentMethod;
}