const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const logger = require("./logger");

AWS.config.update({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION
});

const s3 = new AWS.S3({
  apiVersion: "2006-03-01" // Specify API version for consistency
});

// Configure multer for uploading to S3
const profileUploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      // Provide metadata for the file
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // Generate a unique key for the uploaded file
      const extension = file.originalname.split(".").pop();
      const key = `profile/userimg-${Date.now()}.${extension}`;
      cb(null, key);
    }
  })
});

// Function to delete media from S3
const mediaDeleteS3 = function (filename, callback) {
  const params = {
    Bucket: process.env.BUCKET,
    Key: filename
  };
  // Delete the object from S3
  s3.deleteObject(params, function (err, data) {
    if (err) {
      logger.error("Error deleting file:", err);
      callback(err);
    } else {
      logger.info("File deleted successfully:", data);
      callback(null, data);
    }
  });
};

module.exports = {
  profileUploadS3,
  mediaDeleteS3
};
