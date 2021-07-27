const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const sharp = require("sharp");

const s3 = require("../aws/s3");

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "pinggye-image/image", // 버킷 이름
    contentType: multerS3.AUTO_CONTENT_TYPE, // 파일 MIME 타입 자동 감지
    shouldTransform: true, // 리사이징 true: transforms 속성 필요
    transforms: [
      {
        id: "original",
        key: function (req, file, cb) {
          cb(null, Date.now() + "." + file.originalname.split(".").pop()); // 파일명: 현재시간.원본확장자
        },
        transform: function (req, file, cb) {
          cb(null, sharp()); // 원본
        },
      },
      {
        id: "thumbnail",
        key: function (req, file, cb) {
          cb(null, Date.now() + "t." + file.originalname.split(".").pop());
        },
        transform: function (req, file, cb) {
          cb(null, sharp().resize(200, 200)); // 리사이징
        },
      },
    ],
    acl: "public-read",
  }),
});

module.exports = upload;