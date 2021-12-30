import db from "../config/db";

export const getEmail = (email,result) => {
    db.query("SELECT * FROM users WHERE email = ?", [ email ],(err,results) => {
        if(err){
            console.log(err);
            result(err,null);
        }else{
            result(null,results);
        }
    })
}

export const insertUsers = (data,result) => {
    db.query("INSERT INTO users SET ?",[data],(err,results)=>{
        if(err){
            console.log(err);
            result(err,null);
        }else{
            result(null, results);
        }
    });
};