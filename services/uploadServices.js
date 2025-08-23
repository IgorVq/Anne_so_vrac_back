const fs = require('fs');
const path = require('path');

const saveUpload = (file) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

    if (!allowedExtensions.includes(extension)) {
        throw new Error("Extension de fichier non autorisée");
    }

    const fileName = file.originalname.split(".")[0] + Date.now() + extension;
    const targetPath = path.join(__dirname, '../uploads/', fileName);

    fs.renameSync(file.path, targetPath);
    return fileName;
};

const deleteUpload = (fileName) => {
    const targetPath = path.join(__dirname, '../uploads/', fileName);
    fs.unlinkSync(targetPath);
};

module.exports = {
    saveUpload,
    deleteUpload,
};
