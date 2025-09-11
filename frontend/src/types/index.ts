// src/types/index.ts

// Add this type definition to the file.
export type ClassActivity = {
    id: number;
    name: string;
    description: string;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    location: string;
    capacity: number;
    imageUrl: string;
    currentParticipants: number;
}

export type Equipment = {
    id: number;
    name: string;
    type: string;
    zone: string;        // เปลี่ยนจาก location เป็น zone
    status: string;
    condition: string;   // เพิ่ม condition
    usageHours: number;  // เพิ่ม usageHours
}

export type Facility = {
    id: number;
    name: string;
    zone: string;
    status: string;
    capacity: number;
}

// New types for Form Data
export type EquipmentFormData = {
    id?: number;
    name?: string;
    type?: string;
    zone?: string;        // เปลี่ยนจาก location เป็น zone
    status?: string;
    condition?: string;   // เพิ่ม condition
    usageHours?: string;  // เพิ่ม usageHours
}

export type FacilityFormData = {
    id?: number;
    name?: string;
    zone?: string;
    status?: string;
    capacity?: string;
}