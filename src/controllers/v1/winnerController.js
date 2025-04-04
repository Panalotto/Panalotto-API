import lottoPost from "../../models/lottopost.js";
import LottoWinner from "../../models/lottowinner.js";
import jwt from 'jsonwebtoken';
import '../../core/database.js';

class WinnerController {
    constructor() {
        this.getwinners = new lottoPost();
        this.lottowinner = new LottoWinner();
        this.__controllerName = 'Result';
    }

    async getthewinner(req, res){
        try {
            const result = await this.lottowinner.checkWinners();
    
            if (result.success) {
                return res.json({
                    success: true,
                    message: result.message,
                });
            } else {
                return res.json({
                    success: false,
                    message: result.message,
                });
            }
        } catch (error) {
            console.error("<error> getthewinner:", error);
            res.status(500).json({ success: false, message: "Error fetching lotto winner." });
        }
    }






    async getAllwinners(req, res) {
        try {
            const winners = await this.getwinners.getalluserbet();
            console.log("All BETS:", winners); // Debugging
    
            return res.status(200).json({
                success: true,
                message: "All USER BETS  successfully!",
                data: winners
            });
        } catch (err) {
            console.error("<error> WinnerController.getAllwinners:", err);
            return res.status(500).json({
                success: false,
                message: err.message || "An error occurred while fetching winners."
            });
        }
    }
    
    }

export default WinnerController;
