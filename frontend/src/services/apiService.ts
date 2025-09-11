import axios from 'axios';
import type { ClassActivity, Equipment, Facility } from '../types';

const API_URL = 'http://localhost:8000/api';
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// เพิ่ม response interceptor เพื่อจัดการ error
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        // ถ้าเป็น 401 Unauthorized ให้ clear localStorage และ redirect
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ฟังก์ชันสำหรับอัปโหลดไฟล์รูปภาพ
export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    // ใช้อินสแตนซ์ที่มี Authorization interceptor และทำให้ URL เป็น absolute
    const response = await api.post(`/upload-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    const imageUrl: string = response.data.imageUrl;
    const backendOrigin = API_URL.replace(/\/api$/, '');
    return imageUrl.startsWith('/uploads') ? `${backendOrigin}${imageUrl}` : imageUrl;
};

// --- ClassActivity API Functions ---
export const getAllClasses = async (): Promise<ClassActivity[]> => {
    try {
        const response = await api.get(`/classes`);
        return response.data;
    } catch (error) {
        console.error('Error fetching classes:', error);
        throw error;
    }
};

export const getClassById = async (id: number): Promise<ClassActivity> => {
    try {
        const response = await api.get(`/classes/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching class by id:', error);
        throw error;
    }
};

// **แก้ไข**: ฟังก์ชัน Create และ Update ต้องรองรับการส่งข้อมูลแบบ FormData
export const createClass = async (newClass: Omit<ClassActivity, 'id' | 'currentParticipants'>): Promise<ClassActivity> => {
    try {
        const response = await api.post(`/classes`, newClass);
        return response.data;
    } catch (error) {
        console.error('Error creating class:', error);
        throw error;
    }
};

export const updateClass = async (id: number, updatedClass: Omit<ClassActivity, 'currentParticipants'>): Promise<ClassActivity> => {
    try {
        const response = await api.put(`/classes/${id}`, updatedClass);
        return response.data;
    } catch (error) {
        console.error('Error updating class:', error);
        throw error;
    }
};

export const deleteClass = async (id: number): Promise<void> => {
    try {
        await api.delete(`/classes/${id}`);
    } catch (error) {
        console.error('Error deleting class:', error);
        throw error;
    }
};


// --- Equipment API Functions ---
export const getAllEquipments = async (): Promise<Equipment[]> => {
    try {
        const response = await api.get(`/equipments`);
        return response.data;
    } catch (error) {
        console.error('Error fetching equipments:', error);
        throw error;
    }
};

export const getEquipmentById = async (id: number): Promise<Equipment> => {
    try {
        const response = await api.get(`/equipments/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching equipment by id:', error);
        throw error;
    }
};

export const createEquipment = async (newEquipment: Omit<Equipment, 'id'>): Promise<Equipment> => {
    try {
        const response = await api.post(`/equipments`, newEquipment);
        return response.data;
    } catch (error) {
        console.error('Error creating equipment:', error);
        throw error;
    }
};

export const updateEquipment = async (id: number, updatedEquipment: Equipment): Promise<Equipment> => {
    try {
        const response = await api.put(`/equipments/${id}`, updatedEquipment);
        return response.data;
    } catch (error) {
        console.error('Error updating equipment:', error);
        throw error;
    }
};

export const deleteEquipment = async (id: number): Promise<void> => {
    try {
        await api.delete(`/equipments/${id}`);
    } catch (error) {
        console.error('Error deleting equipment:', error);
        throw error;
    }
};

// --- Facility API Functions ---
export const getAllFacilities = async (): Promise<Facility[]> => {
    try {
        const response = await api.get(`/facilities`);
        return response.data;
    } catch (error) {
        console.error('Error fetching facilities:', error);
        throw error;
    }
};

export const getFacilityById = async (id: number): Promise<Facility> => {
    try {
        const response = await api.get(`/facilities/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching facility by id:', error);
        throw error;
    }
};

export const createFacility = async (newFacility: Omit<Facility, 'id'>): Promise<Facility> => {
    try {
        const response = await api.post(`/facilities`, newFacility);
        return response.data;
    } catch (error) {
        console.error('Error creating facility:', error);
        throw error;
    }
};

export const updateFacility = async (id: number, updatedFacility: Facility): Promise<Facility> => {
    try {
        const response = await api.put(`/facilities/${id}`, updatedFacility);
        return response.data;
    } catch (error) {
        console.error('Error updating facility:', error);
        throw error;
    }
};

export const deleteFacility = async (id: number): Promise<void> => {
    try {
        await api.delete(`/facilities/${id}`);
    } catch (error) {
        console.error('Error deleting facility:', error);
        throw error;
    }
};