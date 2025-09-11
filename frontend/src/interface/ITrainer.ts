// src/interface/ITrainer.ts
import type { UploadFile } from 'antd/es/upload/interface';

export interface TrainerInterface {
  ID?: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  skill: string;
  tel: string;
  gender_id: number;
  profile_image?: string | UploadFile[];
  Actor?: string
}