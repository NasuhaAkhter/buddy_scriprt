
// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class commonService {
    
    public async formatedData(data :any){
        data.str  = data.str ? data.str : '';
        data.pageSize = data.pageSize ? data.pageSize : 10;
        data.colName = data.colName ? data.colName : 'id';
        data.order = data.order ? data.order : 'desc';
        data.page = data.page ? data.page : 1;
        data.page_id = data.page ? data.page_id : 0;
        return data
    }
   
    
    
    
    
};
