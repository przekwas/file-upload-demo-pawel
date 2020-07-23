import * as path from 'path';
import * as crypto from 'crypto';
import * as express from 'express';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import * as aws from 'aws-sdk';
import * as mysql from 'mysql';

const pool = mysql.createPool({
	host: 'localhost',
	user: 'all',
	password: 'all',
	database: 'uploading_demo'
});

const router = express.Router();

const s3 = new aws.S3({
	accessKeyId: 'AKIAIEMGRXQOZQZIABZA',
	secretAccessKey: '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'
});

//preconfigure with extra options
const storage = multerS3({
	s3,
	bucket: 'luke-uploading-demo',
	acl: 'public-read',
	metadata: function (req, file, cb) {
		cb(null, { fieldName: file.fieldname });
	},
	key: function (req, file, cb) {
		cb(null, Date.now().toString() + path.extname(file.originalname));
	}
});

//makes express upload middleware
const upload = multer({ storage });

router.post('/auth/users/register', upload.single('avatar'), (req: any, res, next) => {
	const id = crypto.randomBytes(16).toString('hex');
	const username = req.body.username;
	const avatar_url = req.file.location;

	pool.query(
		'INSERT INTO users (username, avatar_url, id) VALUE (?)',
		[[username, avatar_url, id]],
		(err, results) => {
			if (err) {
				res.status(500).json({ msg: 'you fucked up idiot', err });
			} else {
				res.json({ msg: `uploaded ${req.file.originalname}`, url: req.file.location, inserted: id });
			}
		}
	);
});

router.get('/api/users', (req, res) => {
	pool.query('SELECT * FROM users ORDER BY created_at DESC', (err, results) => {
		if (err) {
			res.status(500).json({ msg: 'you fucked up idiot', err });
		} else {
			res.json(results);
		}
	})
});

export default router;
