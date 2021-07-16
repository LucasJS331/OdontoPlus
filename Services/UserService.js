const mongoose = require("mongoose");
const User = require("../Models/User");
const bcrypt = require("bcrypt");

let userModel = mongoose.model("user", User);

class UserService {

    async CreateUser(name,email, password){
        try {
            let salt = 10;

            let hash = await bcrypt.hashSync(password, salt);
       
             let newUser = new userModel({
                    name,
                    email,
                    password: hash
                })

                await newUser.save();

                let result = {
                    status: true
                }

                return result;
           
    
        } catch (error) {
            console.log(error);
            let result = {
                status: false
            }

            return result;
       
            
        }
    }
    async SelectUserByEmail(email){
        try {
            let user = await userModel.findOne({email: email});
            
            if(user != undefined){
                // usuario existe
                return user;
            }else{
                // usuario nao existe
                return undefined;
            }
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async VerifyUserExistByEmail(email){
        try{
            let user =  await userModel.findOne({email: email});
            if(user != undefined){
                // se o usuario existir:
                return true;
            }
            else{
                // se o usuario não existir:
                return false;
            }
        } 
        catch(err){
            console.log(err);
            return undefined;
        }
    }

    async Auth(email, passowrd){

        try {
            //verificar se o usuario existe por Email
            let veryIfUserExist = await this.VerifyUserExistByEmail(email);

            if(veryIfUserExist){
                // se existir verifique a senha
                let user = await userModel.findOne({email: email});
                
                let veriFyPassword = await bcrypt.compareSync(passowrd,user.password);

                if(veriFyPassword){
                    let auth = {
                        status: true,
                        email: user.email,
                        name: user.name                
                    }

                    return auth;
                }
                else{
                    // senha não bate, autentificação não realizada
                    let auth = {
                        status: false                      
                    }

                    return auth;
                }
            } else{
                // email não existe
                let auth = {
                    status: false
                }

                return auth;
            }
        } catch (error) {
            console.log(error);
            let auth = {
                status: false                      
            }

            console.log("verify false err " + auth);
            return auth;
        }
    }

   
}

module.exports = new UserService;