import lottoPost from "../../models/lottopost.js";

class HomeController{
    constructor(){
        this.winning = new lottoPost();
        this.__controllerName = 'Home';
    }

    async getAllWinningLotto( req, res){
        try {

            const result = await this.winning.getWinning();

            res.send({
                success: true,
                data: {
                    result,
                }
            });
        } catch (err){
            res.send({
                success: true,
                message: err.toString()
            });
        }
    }
}

export default HomeController;