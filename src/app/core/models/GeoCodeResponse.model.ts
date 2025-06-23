export interface GeocodeResponse {
    status: string;
    results: Array<{
        formatted_address: string;
        address_components: Array<{
            long_name: string;
            types: string[];
        }>;
    }>;
}