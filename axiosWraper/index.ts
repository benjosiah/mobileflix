import axios from "axios";
import { paystack } from "Config/service";

const PaystackAxios = axios.create({
    baseURL: paystack.base_rl,
    headers:{
        "Authorization": "Bearer "+ paystack.secret,
        "Accept":"application/json"
    }
 });

 export {PaystackAxios}


