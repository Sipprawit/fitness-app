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
    const response = await api.get(`/classes`);
    return response.data;
};

export const getClassById = async (id: number): Promise<ClassActivity> => {
    const response = await api.get(`/classes/${id}`);
    return response.data;
};

// **แก้ไข**: ฟังก์ชัน Create และ Update ต้องรองรับการส่งข้อมูลแบบ FormData
export const createClass = async (newClass: Omit<ClassActivity, 'id' | 'currentParticipants'>): Promise<ClassActivity> => {
    const response = await api.post(`/classes`, newClass);
    return response.data;
};

export const updateClass = async (id: number, updatedClass: Omit<ClassActivity, 'currentParticipants'>): Promise<ClassActivity> => {
    const response = await api.put(`/classes/${id}`, updatedClass);
    return response.data;
};

export const deleteClass = async (id: number): Promise<void> => {
    await api.delete(`/classes/${id}`);
};


// --- Equipment API Functions ---
export const getAllEquipments = async (): Promise<Equipment[]> => {
    const response = await api.get(`/equipments`);
    return response.data;
};

export const getEquipmentById = async (id: number): Promise<Equipment> => {
    const response = await api.get(`/equipments/${id}`);
    return response.data;
};

export const createEquipment = async (newEquipment: Omit<Equipment, 'id'>): Promise<Equipment> => {
    const response = await api.post(`/equipments`, newEquipment);
    return response.data;
};

export const updateEquipment = async (id: number, updatedEquipment: Equipment): Promise<Equipment> => {
    const response = await api.put(`/equipments/${id}`, updatedEquipment);
    return response.data;
};

export const deleteEquipment = async (id: number): Promise<void> => {
    await api.delete(`/equipments/${id}`);
};

// --- Facility API Functions ---
export const getAllFacilities = async (): Promise<Facility[]> => {
    const response = await api.get(`/facilities`);
    return response.data;
};

export const getFacilityById = async (id: number): Promise<Facility> => {
    const response = await api.get(`/facilities/${id}`);
    return response.data;
};

export const createFacility = async (newFacility: Omit<Facility, 'id'>): Promise<Facility> => {
    const response = await api.post(`/facilities`, newFacility);
    return response.data;
};

export const updateFacility = async (id: number, updatedFacility: Facility): Promise<Facility> => {
    const response = await api.put(`/facilities/${id}`, updatedFacility);
    return response.data;
};

export const deleteFacility = async (id: number): Promise<void> => {
    await api.delete(`/facilities/${id}`);
};