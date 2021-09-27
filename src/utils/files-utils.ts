import multer from "multer";
import fs from "fs";

export const ACCEPTED_TYPES: string[] = [ ".jpg", ".jpeg", ".png", ".gif" ];
export const MAX_SIZE_IMG: number = 10000000;
export const TEMP_LOCAL_PATH_ON_UPLOAD:string = "./public/uploads/img";

export const initializeMulter = () => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, TEMP_LOCAL_PATH_ON_UPLOAD);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });
    
    const upload = multer({ storage: storage });

    // @description: USAR O NOME "img" PARA KEY DO ARQUIVO ANEXADO NO FORM-DATA (SENÃO DÁ EXCEPTION)
    return upload.single("img");
}

export const removeLocalFile = (filePath: string) => {
    fs.unlink(filePath, (err) => {
        console.log("Error trying to remove a local file.");
    });
}

