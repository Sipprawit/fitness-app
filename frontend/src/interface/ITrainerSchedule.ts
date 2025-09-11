import type { TrainBookingInterface } from "./ITrainBooking";
import type { TrainerInterface } from "./ITrainer";


export interface ITrainerSchedule {

    ID?: number;
    available_date: string;
    start_time: string;
    end_time: string;
    TrainerID: number;
    Trainer?: TrainerInterface;
    Status?: string;
    
    Booking?: TrainBookingInterface[];
}