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
