import lottoPost from "../../models/lottopost.js";

class ResultController {
    constructor() {
        this.lottoResult = new lottoPost();
        this.__controllerName = 'Result';
    }

    async latestDrawId(req, res) {
        try {
            const latestDrawID = await this.lottoResult.latestdraw_id();
            return res.status(200).json({
                success: true,
                latest_draw_id: latestDrawID
            });
        } catch (error) {
            console.error("<error> resultController.latestDrawId", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch the latest draw ID."
            });
        }
    }


    

    async latestDrawResult(req, res) {
        try {
            const latestDraw = await this.lottoResult.latestdraw_result();
    
            if (!latestDraw) {
                return res.status(404).json({
                    success: false,
                    message: "No draw results found."
                });
            }
    
            return res.status(200).json({
                success: true,
                latest_draw_id: latestDraw.draw_id,  // ✅ Extract draw_id
                draw_time: latestDraw.draw_time,
                winning_numbers: latestDraw.winning_numbers  // ✅ Include numbers
            });
        } catch (error) {
            console.error("<error> resultController.latestDrawResult", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch the latest draw result."
            });
        }
    }
    





    async insertResult(req, res) {
        try {
            const { winning_numbers } = req.body;

            // Basic validation
            if (!winning_numbers) {
                return res.status(400).json({ message: "Missing required fields." });
            }

            
            console.log("Received Data:", req.body);

            const newResult = await this.lottoResult.insert_Result(winning_numbers);

            return res.status(201).json({ message: "Lotto result saved successfully.", data: newResult });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error.", error: error.message });
        }
    }
}

export default ResultController;
