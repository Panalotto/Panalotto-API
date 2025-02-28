import { connection } from "../core/database.js";

class lottoPost {
    constructor() {
        this.lotto = connection;
    
    }


    async getWinning() {
        try {
            const [result] = await this.lotto.execute(
                'SELECT draw_id, draw_time, winning_numbers, created_at FROM lotto_draws ORDER BY draw_time DESC LIMIT 1'
            );
            return result;
        } catch (err) {
            console.error('<error> lottoPost.getWinning', err);
            throw new Error('An error occurred while fetching lotto winning. Please try again later.');
        }
    }
    

    
    
}

export default lottoPost;
