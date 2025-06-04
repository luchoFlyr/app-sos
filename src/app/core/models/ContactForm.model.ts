export interface ContactForm {
    name: string;
    phone: string;
    message: string;
    allowCall: boolean;
    allowSms?: boolean;
    allowLocation: boolean;
    allowPhoto: boolean;
    type?: string
}
