import type { TrainBookingInterface } from "./ITrainBooking";


export interface ITrainerSchedule {

    ID?: number;
    available_date: string;
    start_time: string;
    end_time: string;
    TrainerID: number;
    Status?: string;
    
    Booking?: TrainBookingInterface[];
}