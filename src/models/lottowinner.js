import { masterConnection, slaveConnection } from "../core/database.js";
import lottoPost from "./lottopost.js";

class LottoWinner {
    constructor() {
        this.lottopost = new lottoPost();
        this.master = masterConnection
        this.slave = slaveConnection
    }

    /**
     * Check for winners based on the latest draw.
     */
    async checkWinners() {
        try {
            // 🔹 1. Kunin ang latest draw
            const [latestDraw] = await this.slave.execute(
                `SELECT draw_id, winning_numbers 
                 FROM lotto_draws 
                 ORDER BY draw_id DESC 
                 LIMIT 1`
            );
    
            if (latestDraw.length === 0) {
                console.log("<error> No draw found.");
                return { success: false, message: "No draw found." };
            }
    
            const { draw_id, winning_numbers } = latestDraw[0];
    
            console.log("<debug> Latest draw ID:", draw_id);
            console.log("<debug> Winning numbers:", winning_numbers);
    
            // 🔹 2. Kunin ang pot money gamit ang getAllBets()
            const potData = await this.lottopost.getAllBets();
    
            if (!potData || !potData.draw_id) {
                console.log("<error> No pot money record found.");
                return { success: false, message: "No pot money found for this draw." };
            }
    
            const { talpak_money: pot_money } = potData;
            console.log("<debug> Pot Money:", pot_money);
    
            // 🔹 3. Kunin ang lahat ng bets para sa latest draw
            const [bets] = await this.slave.execute(
                `SELECT user_id, numbers, bet_amount FROM bets WHERE draw_id = ?`,
                [draw_id]
            );
    
            if (bets.length === 0) {
                console.log("<error> No bets found for draw ID:", draw_id);
                return { success: false, message: "No bets for this draw." };
            }
    
            console.log("<debug> Total Bets:", bets.length);
    
            // 🔹 4. Convert `winning_numbers` to an array
            const winningArray = winning_numbers
                .split("-")
                .map(num => parseInt(num.trim(), 10));
    
            console.log("<debug> Converted Winning Numbers:", winningArray);
    
            // 🔹 5. Process Bets
            let allBets = [];
            let winners = [];
    
            for (const bet of bets) {
                // Convert bet numbers to array
                const betNumbers = bet.numbers
                    .split("-")
                    .map(num => parseInt(num.trim(), 10));
    
                console.log(`<debug> Checking User ${bet.user_id}:`, betNumbers);
    
                allBets.push({
                    user_id: bet.user_id,
                    numbers: bet.numbers,
                    bet_amount: bet.bet_amount
                });
    
                if (
                    betNumbers.length === winningArray.length &&
                    betNumbers.every(num => winningArray.includes(num))
                ) {
                    winners.push({ user_id: bet.user_id });
                }
            }
    
            if (winners.length === 0) {
                console.log("<info> No winners this round.");
                return {
                    success: false,
                    draw_id,
                    winning_numbers,
                    all_bets: allBets,
                    message: "No winners this round."
                };
            }
    
            // 🔹 6. Compute prize money per winner
            const prizePerWinner = pot_money / winners.length;
    
            // 🔹 7. Update balance ng winners
            for (const winner of winners) {
                await this.master.execute(
                    "UPDATE users SET balance = balance + ? WHERE user_id = ?",
                    [prizePerWinner, winner.user_id]
                );
    
                winner.prize_money = prizePerWinner;
            }
    
            console.log("<debug> Winners:", winners);
    
            // 🔹 8. Reset `talpak_money` to 1000
            await this.master.execute(
                "UPDATE lotto_pot_money SET talpak_money = 10000000 WHERE draw_id = ?",
                [draw_id]
            );
    
            console.log("<debug> talpak_money reset to 1000");
    
            return {
                success: true,
                draw_id,
                winning_numbers,
                all_bets: allBets,
                winners
            };
    
        } catch (err) {
            console.error("<error> lottoWinner.checkWinners:", err);
            return { success: false, message: err.message };
        }
    }
    


    /**
     * Get the latest winning draw details.
     */
    async getLatestWinningResult() {
        try {
            const [rows] = await this.slave.execute(
                `SELECT draw_id, winning_numbers, pot_money, created_at 
                 FROM lotto_draws 
                 ORDER BY draw_id DESC 
                 LIMIT 1`
            );

            if (rows.length > 0) {
                return rows[0];
            } else {
                return null;
            }
        } catch (err) {
            console.error("<error> lottoWinner.getLatestWinningResult:", err);
            throw new Error("An error occurred while fetching the latest winning draw.");
        }
    }
}

export default LottoWinner;
