export interface ContactPayload {
    Name: string;
    Phone: string;
    Message: string;
    AllowCall: boolean;
    AllowSMS: boolean;
    AllowGeo: boolean;
}
export interface ContactResponse extends ContactPayload {
    _id: string;
}
