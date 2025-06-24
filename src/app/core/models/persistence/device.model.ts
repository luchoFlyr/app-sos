export interface DeviceInfo {
    DeviceID: string;
    NameDevice: string;
}
export interface Device {
    _id: string;
    deviceInfo: DeviceInfo;
    contacts: any[];
    emergencyRegisters: any[];
}
