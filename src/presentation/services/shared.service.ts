import { CustomError } from "../../domain";
import mongoose from 'mongoose';


export class SharedService {

    public validateId( id: string, message: string = 'Invalid Id' ) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw CustomError.badRequest(message);
        return true;
    }
}