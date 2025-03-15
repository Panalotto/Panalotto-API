import { connection } from "../core/database.js";


class lottoPost {
    constructor() {
        this.lotto = connection;
    
    }
    async insert_Result(draw_id, draw_time, winning_numbers) {
        try {

            const [result] = await this.lotto.execute(
                `INSERT INTO lotto_draws (draw_id, draw_time, winning_numbers, created_at) VALUES (?, ?, ?, NOW())`,
                [draw_id, draw_time, winning_numbers]
            );
            return result;
        } catch (err) {
            console.error('<error> lottoPost.insert_Result', err);
            throw new Error('An error occurred while inserting lotto result.');
        }
    }

    async placebet(user_id, numbers, bet_amount) {
        try {
            // Get user balance
            const [user] = await this.lotto.execute(
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
            await this.lotto.execute(
                `INSERT INTO bets (draw_id, user_id, numbers, bet_amount) VALUES (?, ?, ?, ?)`,
                [draw_id, user_id, numbers, bet_amount]
            );
    
            // Deduct balance
            const newBalance = currentBalance - bet_amount;
            await this.lotto.execute(
                "UPDATE users SET balance = ? WHERE user_id = ?",
                [newBalance, user_id]
            );
    
            // Get previous draw talpak_money
            const [previousPot] = await this.lotto.execute(
                "SELECT talpak_money FROM lotto_pot_money ORDER BY draw_id DESC LIMIT 1"
            );
    
            let previousTalpakMoney = previousPot.length ? previousPot[0].talpak_money : 0;
    
            console.log("Previous Talpak Money:", previousTalpakMoney);  // Debugging
            console.log("New Bet Amount:", bet_amount);
    
            // Compute new talpak_money
            let newTalpakMoney = previousTalpakMoney + bet_amount;
    
            // Insert or update new draw talpak_money
            await this.lotto.execute(
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
    
    
    
    //
    async getAllBets() {
        try {
            const [result] = await this.lotto.execute(
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
    
    
    





    async latestdraw_id() {
        try {
            const [rows] = await this.lotto.execute(
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
            const [rows] = await this.lotto.execute(
                `SELECT draw_id, draw_time, winning_numbers, created_at 
                 FROM lotto_draws 
                 ORDER BY created_at DESC 
                 LIMIT 1`
            );
    
            if (rows.length > 0) {
                let winningNumbers;
                try {
                    winningNumbers = JSON.parse(rows[0].winning_numbers);
                } catch (error) {
                    console.warn("<warning> Invalid JSON format in winning_numbers:", rows[0].winning_numbers);
                    winningNumbers = rows[0].winning_numbers.split(',').map(num => parseInt(num.trim(), 10));
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
            const [result] = await this.lotto.execute(
                "SELECT MAX(draw_id) AS last_draw_id FROM lotto_draws"
            );
            return result[0]?.last_draw_id || 0;
        } catch (err) {
            console.error("<error> lottoPost.getWinning", err);
            throw new Error("An error occurred while fetching the last draw ID.");
        }
    }
    
    

    
    
}

export default lottoPost;
