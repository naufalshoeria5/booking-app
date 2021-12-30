import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { getEmail, insertUsers } from "../models/authModel";

export const login = (req, res) => {
    const body = req.body;
    const validated_email = validate_email(body.email);
    if (!validated_email) {
        res.status(500).send({
            meta: { code: 500, status: "error", message: "Email not valid" },
          });
    } else {
        let email = body.email;
        getEmail(email, (err,results) => {
            if (err) {
                res
                .status(500)
                .send({ meta: { code: 500, status: "error", message: err } });
            } else {
                if (results.length != 0) {
                    const user = results[0];
                    bcrypt.compare(body.password, user.password, function (err,results) {
                        if (results == true) {
                            const token = jwt.sign(
                                { id: user.id, email: user.email},
                                process.env.ACCESS_TOKEN_SECRET
                            );
                            res.status(200).send({
                                meta:{
                                    code: 200,
                                    status: 'succes',
                                    message: 'Login success',
                                },
                                data: {
                                    status: 1,
                                    message: "Welcome!",
                                    userId: user.id,
                                    fullname: user.fullname,
                                    token: token,
                                },
                            });
                        } else {
                            res.status(500).send({
                                meta: { code: 500, status: "error", message: "Wrong password" },
                            });
                        }
                    });
                } else {
                    res.status(404).send({
                      meta: { code: 404, status: "error", message: "Email Not found" },
                    });
                }
            }
        });
    }
}

export const signup = (req,res) => {
    const data = req.body;
    
    let validated_pass = validate_password(data.password);
    const validated_email = validate_email(data.email);

    if (!validated_pass) {
        res.send({
            status: 0,
            message: validated_pass[1]
        });
    } else {
        if (!validated_email) {
            res.status(500).send({
                meta: {code: 500, status: "error", message: "Email Not Valid"}
            });
        } else {
            let email = data.email;
            getEmail(email,(err,results) => {
                if (err) {
                    res
                    .status(500)
                    .send({ meta: {code:500,status:"error",message:err}});
                } else {
                    if (Object.keys(results).length == 0) {
                        var salt = bcrypt.genSaltSync(10);
                        validated_pass = bcrypt.hashSync(data.password, salt);
                        const data1 = {
                            fullname: data.fullname,
                            email: data.email,
                            password: validated_pass
                        };

                        insertUsers(data1,(err,results) => {
                            if(err){
                                res
                                .status(500)
                                .send({ meta: { code: 500, status: "error", message: err}})
                            }else{
                                res
                                .status(201)
                                .send({
                                    meta:{
                                        code:200,
                                        status:"success",
                                        message: "Berhasil Buat Users",
                                    },
                                    data:results,
                                })
                            }
                        });
                    } else {
                        res
                        .status(500)
                        .send({
                            meta: {
                                code: 500,
                                status: 'error',
                                message: "Email Sudah Digunakan"
                            }
                        })
                    }
                }
            })
        }
    }
}

//Validasi password
const validate_password = (password) => {
    if (password.length < 8) {
      return [false, "Jumlah password minimal 8 karakter"];
    }
    if (!/\d/.test(password)) {
      return [false, "Password harus memiliki alfabet dan numerik"];
    }
    return [true, ""];
  };

  //Validasi Email
const validate_email = (email) => {
const re =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
return re.test(email);
};
  