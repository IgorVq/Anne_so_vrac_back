const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

const upload = multer({ dest: './uploads/' });

router.post('/', upload.single('file'), uploadController.uploadFile);
router.get('/:name', uploadController.getFile);
router.delete('/:name', uploadController.deleteFile);

module.exports = router;
