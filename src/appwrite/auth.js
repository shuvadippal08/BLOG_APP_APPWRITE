import conf from '../conf/conf.js';
import {Client, Account, ID } from 'appwrite';

export class AuthService {
    client = new Client();
    account;
    

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
        this.user = this.account.get();
    }

    async createAccount({email, password, name}){
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if(userAccount){
                //call another method
                return this.login({ email, password });
            }else{
                return userAccount;
            }
        } catch (error) {
            console.log("Appwrite service :: createAccount :: error ",error);
        }
    }

    async login({email, password}) {
        try {
            const sessions= await this.account.createEmailPasswordSession(email, password);
            if(sessions){
                window.location.reload();
            }
            return sessions;
        } catch (error) {
            console.log("Appwrite service :: userLogin :: error ",error);
        }
    }

    async getCurrentUser(){
        try {
            return await this.account.get();
        }catch(error){
            console.log("Appwrite service :: getCurrentUser :: error ",error);
        }

        return null;
    }

    async logout() {
        try {
            await this.account.deleteSessions();
            window.location.reload();
        } catch (error) {
            console.log("Appwrite service :: Logout :: error ",error);
        }
    }

}



const authService = new AuthService();

export default authService

