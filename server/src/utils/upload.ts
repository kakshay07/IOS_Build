import multer from 'multer';

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let destinationDir;

        switch (req.path) {
            case '/upload/logo':
                destinationDir = 'src/uploads/logo/';
                break;
            case '/upload/dp':
                destinationDir = 'src/uploads/dp/';
                break;
            case '/upload/csv':
                destinationDir = 'src/uploads/csv/';
            break;
            default:
                destinationDir = 'src/uploads/';
        }

        cb(null, destinationDir);
    },
    filename: (req, file, cb) => {
        //   cb(null, Date.now() + '-' + file.originalname);

        let fileName;

        switch (req.path) {
            case '/upload/logo':
                fileName = req.query.entity_id + '-' + req.query.user_id + '-' + 'logo';
                break;
            case '/upload/dp':
                fileName = req.query.entity_id + '-' + req.query.user_id + '-' + 'dp';
                break;
            case '/upload/csv':
                fileName = req.query.entity_id + '-' + req.query.user_id + '-' + 'csv';
            break;
            default:
                fileName = Date.now() + '-' + file.originalname;
        }

        // Get the file extension from the original filename
        const fileExtension = file.originalname.split('.').pop();

        // Append the file extension to the generated filename
        fileName += '.' + fileExtension;

        cb(null, fileName);
    },
});

// Create the multer instance
const upload = multer({ storage: storage });

export default upload;
