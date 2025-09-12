export interface Package {
    id?: number;
    ID?: number;
    p_name: string;
    type: string;
    detail: string;
    service_id: number;
    price: number;
    service?: Service;
    detail_service?: Service;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface Service {
    id: number;
    service: string;
    detail: string;
    created_at?: string;
    updated_at?: string;
  }
  