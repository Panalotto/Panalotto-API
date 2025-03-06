import { connection } from "../core/database.js";

class CountDown {
    constructor(io) {
        this.io = io;
        this.lottotimer = connection;
        this.timeLeft = 60;
        this.timer = null;
        this.startCountdown();
    }

    async startCountdown() {
        if (this.timer) clearInterval(this.timer);
        this.timeLeft = 60;

        this.timer = setInterval(async () => {
            this.timeLeft--;

            // 🔥 Broadcast countdown via WebSocket
            this.io.emit("countdown", { timeLeft: this.timeLeft });

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.io.emit("countdown", { timeLeft: 0 });

                // 🎉 Store Lotto Result & Restart
                await this.storeLottoResult();
                setTimeout(() => {
                    this.timeLeft = 60;
                    this.io.emit("countdown", { timeLeft: this.timeLeft });
                    this.startCountdown();
                }, 3000);
            }
        }, 1000);
    }

    async storeLottoResult() {
        try {
            const winningNumber = Math.floor(Math.random() * 100) + 1;
            const sql = "INSERT INTO lotto_results (winning_number, created_at) VALUES (?, NOW())";
            await this.lottotimer.query(sql, [winningNumber]);
            console.log(`🎉 Winning number ${winningNumber} saved to database`);
        } catch (error) {
            console.error("❌ Error storing lotto result:", error);
        }
    }

    stopCountdown() {
        if (this.timer) clearInterval(this.timer);
        this.timer = null;
        this.io.emit("countdown", { timeLeft: "stopped" });
    }

    resetCountdown() {
        this.stopCountdown();
        this.timeLeft = 60;
        this.io.emit("countdown", { timeLeft: this.timeLeft });
        this.startCountdown();
    }
}

export default CountDown;
