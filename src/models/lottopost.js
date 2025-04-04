import { masterConnection, slaveConnection } from "../core/database.js";


class lottoPost {
    constructor() {
        this.master = masterConnection;
        this.slave = slaveConnection;
    
    }
    async insert_Result(winning_numbers) {
        try {
            // Convert array to a comma-separated string
            const winningNumbersString = winning_numbers;
            console.log(winning_numbers);
    
            const [result] = await this.master.execute(
                `INSERT INTO lotto_draws (winning_numbers, created_at) VALUES (?, NOW())`,
                [winningNumbersString]
            );
            return result;
        } catch (err) {
            console.error('<error> lottoPost.insert_Result', err);
            throw new Error('An error occurred while inserting lotto result.');
        }
    }

    


    

    async placebet( user_id, numbers, bet_amount) {
        try {
            // Get user balance
            const [user] = await this.slave.execute(
                "SELECT balance FROM users WHERE user_id = ?",
                [user_id]
            );
    
            if (!user.length) throw new Error("User not found.");
            let currentBalance = user[0].balance;
    
            if (currentBalance < bet_amount) throw new Error("Insufficient balance.");
    
            // Get latest draw_id
            const draw_id = await this.latestdraw_id();

            if (!draw_id) throw new Error("No available draw ID.");
    
            console.log("Current Draw ID:", draw_id);  // Debugging
    
            // Insert bet
            await this.master.execute(
                `INSERT INTO bets (draw_id, user_id, numbers, bet_amount) VALUES (?, ?, ?, ?)`,
                [draw_id , user_id, numbers, bet_amount]
            );
    
            // Deduct balance
            const newBalance = currentBalance - bet_amount;
            await this.master.execute(
                "UPDATE users SET balance = ? WHERE user_id = ?",
                [newBalance, user_id]
            );
    
            // Get previous draw talpak_money
            const [previousPot] = await this.slave.execute(
                "SELECT talpak_money FROM lotto_pot_money ORDER BY draw_id DESC LIMIT 1"
            );
    
            let previousTalpakMoney = previousPot.length ? previousPot[0].talpak_money : 0;
    
            console.log("Previous Talpak Money:", previousTalpakMoney);  // Debugging
            console.log("New Bet Amount:", bet_amount);
    
            // Compute new talpak_money
            let newTalpakMoney = previousTalpakMoney + bet_amount;
    
            // Insert or update new draw talpak_money
            await this.master.execute(
                `INSERT INTO lotto_pot_money (draw_id, talpak_money) 
                 VALUES (?, ?) ON DUPLICATE KEY UPDATE talpak_money = ?`,
                [draw_id, newTalpakMoney, newTalpakMoney]
            );
    
            return { success: true, message: "Bet placed successfully!", newBalance };
        } catch (err) {
            console.error("<error> lottoPost.placebet:", err);
            throw new Error(err.message);
        }
    }
    
    
    
    // thi is for pot
    async getAllBets() {
        try {
            const [result] = await this.slave.execute(
                "SELECT draw_id, talpak_money FROM lotto_pot_money ORDER BY draw_id DESC LIMIT 1"
            );
    
            if (result.length > 0) {
                return result[0];  // Return last draw_id and talpak_money
            } else {
                return { draw_id: null, talpak_money: 0 };  // No previous draw, default to 0
            }
        } catch (err) {
            console.error("<error> lottoPost.getAllBets:", err);
            throw new Error(err.message);
        }
    }
    
    // it will check all bet on that draw-id 
    // and get the winning numbers == numbers
    
    
    
    





    async latestdraw_id() {
        try {
            const [rows] = await this.slave.execute(
                "SELECT MAX(draw_id) AS latest_draw_id FROM lotto_draws"
            );
    
            return rows[0]?.latest_draw_id || 0; // Kung walang result, return 0
        } catch (err) {
            console.error("<error> lottoPost.latestdraw_id", err);
            throw new Error("An error occurred while fetching the latest draw ID.");
        }
    }
    
    async latestdraw_result() {
        try {
            const [rows] = await this.slave.execute(
                `SELECT draw_id, draw_time, winning_numbers, created_at 
                 FROM lotto_draws 
                 ORDER BY draw_id DESC 
                 LIMIT 1 OFFSET 1`
            );
    
            if (rows.length > 0) {
                
                let winningNumbers = rows[0].winning_numbers;
    
                console.log("<debug> Raw winning_numbers:", winningNumbers);
    
                try {
                    winningNumbers = JSON.parse(winningNumbers);
                    
                    // Ensure it's an array
                    if (!Array.isArray(winningNumbers)) {
                        throw new Error("Parsed value is not an array");
                    }
                } catch (error) {
                    console.warn("<warning> Invalid JSON format in winning_numbers:", winningNumbers);
                    
                    // Handle hyphen-separated numbers
                    winningNumbers = winningNumbers
                        .split(/[-,]/)  // Supports both "-" and "," as delimiters
                        .map(num => parseInt(num.trim(), 10))
                        .filter(num => !isNaN(num)); // Remove NaN values
                }
    
                return {
                    ...rows[0],
                    winning_numbers: winningNumbers
                };
            } else {
                return null;
            }
        } catch (err) {
            console.error('<error> lottoPost.latestdraw_result:', err);
            throw new Error('An error occurred while fetching latest lotto result.');
        }
    }
    
    

    

    async getWinning() {
        try {
            const [rows] = await this.slave.execute(
                "SELECT winning_numbers FROM lotto_draws WHERE draw_id = (SELECT MAX(draw_id) FROM lotto_draws)"
            );
    
            // Siguraduhing may result bago mag-access
            if (rows.length === 0) return 0;
    
            return rows[0].winning_numbers;
        } catch (err) {
            console.error("<error> lottoPost.getWinning", err);
            throw new Error("An error occurred while fetching the last winning numbers.");
        }
    }


    async getalluserbet() {
        try {
            // Hanapin ang pinakabagong draw_id mula sa lotto_draws table
            const [latestDraw] = await this.slave.execute(
                "SELECT draw_id FROM lotto_draws ORDER BY created_at DESC LIMIT 1"
            );
    
            const lastDrawId = latestDraw[0]?.draw_id;
    
            // Kung walang draw_id, ibalik lang na walang data
            if (!lastDrawId) return { draw_id: null, bets: [] };
    
            // Kunin lahat ng bets para sa latest draw_id
            const [rows] = await this.slave.execute(
                "SELECT user_id, numbers, bet_amount FROM bets WHERE draw_id = ?",
                [lastDrawId]
            );
    
            return { draw_id: lastDrawId, bets: rows };
        } catch (err) {
            console.error("<error> lottoPost.getalluserbet", err);
            throw new Error("An error occurred while fetching user bets.");
        }
    }

    
    
    
}

export default lottoPost;
