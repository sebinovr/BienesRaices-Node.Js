import multer from "multer"
import path from "path"
import { generarId } from "../helpers/tokens.js"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/')
    },

    filename: (req, file, cb) => {
        cb(null, generarId() + path.extname(file.originalname) )
    }
})

const upload = multer({ storage })

export default upload