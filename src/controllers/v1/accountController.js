import jwt from 'jsonwebtoken';
import User from '../../models/user.js';
import '../../core/database.js';



class AccountController{
    constructor() {

        this.user = new User();
        
    }

    async create(req, res) {
        const { username, email, password } = req.body || {};
    
        try {
            const response = await this.user.create(username, email, password);
    
            res.send({
                success: true,
                data: {
                    recordIndex: response?.insertId,
                },
            });
        } catch (err) {
            
            res.send({
                success: false,
                message: err.message === 'username' || err.message === 'email' ? err.message : 'Failed to create account',
            });
        }
    }

    

    async login(req, res){
        try{
            const { username, password } = req.body || {}

            const result = await this.user.verify(username,  password);

            console.log(result)

            if(!result?.user_id){
                return res.send({
                    success: false,
                    message: 'Invalid username or password',
                })
            } else {
                res.send({
                    success: true,
                    data: {
                        token: jwt.sign({ 'username': username, 'user_id': result?.user_id }, process.env.API_SECRET_KEY, {
                            expiresIn: '1d',
                        })
                    }
                })
            }
        } catch (err){
            res.send({
                success: false,
                message: err.toString(),
            })
        }
    }


    async logout(req, res) {
        try {
            const userId = req.user?.user_id || req.body?.user_id;
    
            if (!userId) {
                return res.status(400).json({ success: false, message: "User ID is required" });
            }
    
            console.log(`Logging out user ID: ${userId}`); // Debugging log
    
            // Optional: Implement session/token invalidation logic here
            const result = await this.user.logout_user(token);
            console.log("Logout result:", result); // Debugging log
    
            res.json({ success: true, message: "Logout successful" });
        } catch (error) {
            console.error("Logout error:", error); // Log the actual error
            res.status(500).json({ success: false, message: "Internal Server Error", error: error.toString() });
        }
    }
    
    
    

    
    async profile(req, res){
        try{
            const userInfo = await this.user.getUser(res.locals.username);

            res.send({
                success: true,
                data: {
                    id: res.locals.user_id,
                    username: res.locals.username,
                    email: userInfo?.email,
                    balance: userInfo?.balance
                 
                }
            })
        } catch (err){
            res.send({
                success: false,
                message: err.toString(),
            });
        }
    }


    async releaseMoney(req, res){

        const port = process.env.API_SECRET_KEY;

        try {
            const { username, amount } = req.body;

            const token = req.headers["token"];
            if (!token) {
                return res.status(401).send({ success: false, message: "No token provided" });
            }

            let loggedInUsername;
            try {
                const decoded = jwt.verify(token, port); 
                loggedInUsername = decoded.username;
            } catch (err) {
                return res.status(403).send({ success: false, message: "Invalid token" });
            }

           
            if (loggedInUsername !== username) {
                return res.status(400).send({ success: false, message: "Username is not your username" });
            }

            if (!amount || isNaN(amount) || amount <= 0) {
                return res.status(400).send({ success: false, message: "Invalid amount" });
            }

            const userInfo = await this.user.releaseBalance(username, parseFloat(amount));

            if (!userInfo) {
                return res.status(404).send({ success: false, message: "User not found" });
            }

            // Success response
            res.send({
                success: true,
                data: {
                    username: userInfo.username,
                    email: userInfo.email,
                    balance: userInfo.balance
                }
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: err.toString(),
            });
        }


     

    }



    async addMoney(req, res) {

        const port = process.env.API_SECRET_KEY;

        try {
            const { username, amount } = req.body;

            const token = req.headers["token"];
            if (!token) {
                return res.status(401).send({ success: false, message: "No token provided" });
            }

            let loggedInUsername;
            try {
                const decoded = jwt.verify(token, port); 
                loggedInUsername = decoded.username;
            } catch (err) {
                return res.status(403).send({ success: false, message: "Invalid token" });
            }

           
            if (loggedInUsername !== username) {
                return res.status(400).send({ success: false, message: "Username is not your username" });
            }

            if (!amount || isNaN(amount) || amount <= 0) {
                return res.status(400).send({ success: false, message: "Invalid amount" });
            }

            const userInfo = await this.user.addBalance(username, parseFloat(amount));

            if (!userInfo) {
                return res.status(404).send({ success: false, message: "User not found" });
            }

            // Success response
            res.send({
                success: true,
                data: {
                    username: userInfo.username,
                    email: userInfo.email,
                    balance: userInfo.balance
                }
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: err.toString(),
            });
        }
    }

     

    // async requestPasswordReset(req, res) { 
    //     const { email } = req.body || {};
    //     try {
    //         const result = await this.user.requestPasswordReset(email);
    //         res.status(200).json(result);
    //     } catch (err) {
    //         res.status(400).json({ error: err.message });
    //     }
        
    // }

    // async resetPassword(req, res) {
    //     const { otp, newPassword } = req.body || {};
    //     try {
    //         const result = await this.user.resetPassword(otp, newPassword);
    //         res.status(200).json(result);
    //     } catch (err) {
    //         res.status(400).json({ error: err.message });
    //     }
    // }



   
    

}



export default AccountController;