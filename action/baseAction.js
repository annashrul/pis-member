
import Action from "./httpService";

export const handleGet = async(url,callback)=>{
    try{
        const getData=await Action.get(Action.apiUrl+url);
        const datum = getData.data;
        console.log(datum);
        callback(datum,false);
    }catch (err){
        callback([],false);
    }
};