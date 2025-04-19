import { JwtPayload } from "jsonwebtoken";
import { IAdvice } from "./advice.interface";
import { Advice } from "./advice.model";
import QueryBuilder from "../../builder/QueryBuilder";

const createAdviceToDB = async (adviceData: Partial<IAdvice>,user:JwtPayload) => {
    const createAdvice = await Advice.create({...adviceData,user:user.id});
    return createAdvice;
}



const getAdviceByIdFromDB = async (id:string,query:Record<string,any>) => {
    const result = new QueryBuilder(Advice.find({ user: id }),query).paginate().search(['title']).sort();
    const paginateInfo = await result.getPaginationInfo();
    const getAdvice = await result.modelQuery.populate(['user'],['name','image']).exec();
    if (!getAdvice) {
        throw new Error('Failed to get advice');
    }
        
    
    return {
        advice: getAdvice,
        paginateInfo
    };
}

const updateAdviceToDB = async (adviceId: string, payload: Partial<IAdvice>,user:JwtPayload) => {
    const updateAdvice = await Advice.findOneAndUpdate({ _id: adviceId,user:user.id }, payload, { new: true })
  
    return updateAdvice;
}

const deleteAdviceFromDB = async (adviceId: string,user:JwtPayload) => {
    const deleteAdvice = await Advice.findOneAndDelete({ _id: adviceId,user:user.id }).exec();
    if (!deleteAdvice) {
        throw new Error('Failed to delete advice');
    }
    return deleteAdvice;
}

export const AdviceService = {
    createAdviceToDB,
    getAdviceByIdFromDB,
    updateAdviceToDB,
    deleteAdviceFromDB    
}