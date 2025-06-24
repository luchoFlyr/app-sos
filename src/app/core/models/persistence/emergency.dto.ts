export interface EmergencyPayload {
    latitude: number;
    longitude: number;
}
export interface EmergencyResponse extends EmergencyPayload {
    _id: string;
}
