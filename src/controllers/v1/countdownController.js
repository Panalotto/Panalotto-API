class CountdownController {
    constructor(io) {
        this.io = io;
        this.countdown = 60; // Initial countdown time in seconds
        this.isRunning = false;
        this.interval = null;
    }

    // Fetch the current countdown value
    getCountdown(req, res) {
        res.json({ countdown: this.countdown, isRunning: this.isRunning });
    }

    // Start the countdown timer
    startCountdown(req, res) {
        if (this.isRunning) {
            return res.json({ message: "Countdown already running", countdown: this.countdown });
        }

        this.isRunning = true;
        this.interval = setInterval(() => {
            if (this.countdown > 0) {
                this.countdown--;
                this.io.emit("updateCountdown", { countdown: this.countdown });
            } else {
                clearInterval(this.interval);
                this.isRunning = false;
                this.io.emit("countdownFinished");
            }
        }, 1000);

        res.json({ message: "Countdown started", countdown: this.countdown });
    }

    // Reset the countdown
    resetCountdown(req, res) {
        clearInterval(this.interval);
        this.countdown = 60;
        this.isRunning = false;
        this.io.emit("updateCountdown", { countdown: this.countdown });

        res.json({ message: "Countdown reset", countdown: this.countdown });
    }
}

export default CountdownController;
