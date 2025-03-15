import lottoPost from "../../models/lottopost.js";
import jwt from 'jsonwebtoken';
import '../../core/database.js';

class TalpakController {
    constructor() {
        this.lottoResult = new lottoPost();
        this.__controllerName = 'Result';
    }

    async talpaksalotto(req, res) {
        const secretKey = process.env.API_SECRET_KEY;

        try {
            const { numbers ,bet_amount} = req.body;


            const token = req.headers["token"];
            if (!token) {
                return res.status(401).send({ success: false, message: "No token provided" });
            }

            let decoded;
            try {
                decoded = jwt.verify(token, secretKey);
            } catch (err) {
                return res.status(403).send({ success: false, message: "Invalid token" });
            }

            const user_id = decoded.user_id;
            const username = decoded.username;

            
            const result = await this.lottoResult.placebet( user_id, numbers, bet_amount);

            res.send({
                success: true,
                data: {
                    username,
                    numbers
                }
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: err.toString(),
            });
        }
    }


    async getAllTalpak(req, res) {
        try {
        
            const result = await this.lottoResult.getAllBets();

            res.json({
                success: true,
                data: result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.toString()
            });
        }
    }


    

    
    
    
    
    

}

export default TalpakController;
