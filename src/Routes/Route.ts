// import express,{Application} from 'express'
// import multer from "multer"

// import { TranscodeController } from "../Controllers/Transcode.controller";
// import { TranscodeInteractor } from "../Interactor/Transcode.interactor";
// import { TranscodeRepository } from "../Repositories/Transcode.Repository";

// const storage = multer.memoryStorage()
// const upload = multer({storage})

// const TranscoderRoute:Application = express()


// const repository = new TranscodeRepository()
// const interactor = new TranscodeInteractor(repository)
// const controller = new TranscodeController(interactor)
                        
// TranscoderRoute.post("/",upload.single("file"),'')
// TranscoderRoute.get("/videoURL",controller.getData.bind(controller))

// export default TranscoderRoute