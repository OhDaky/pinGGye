module.exports = async (req, res) => {
  // 이미지 서버에 이미지 저장
  if (!req.file) {
    return res.status(500).json({ message: "Image does not exist" });
  }
  const imagesInfo = req.file.transforms;

  let imageSrc, thumbnailSrc;

  // S3 이미지 서버에 저장된 이미지의 url 경로 획득
  imagesInfo.forEach((imageInfo) => {
    if (imageInfo.id === "thumbnail") thumbnailSrc = imageInfo.location;
    else if (imageInfo.id === "original") imageSrc = imageInfo.location;
  });

  if (!imageSrc || !thumbnailSrc) {
    return res.status(500).json({ data: null, message: "Image upload failed" });
  }

  res.status(201).json({ data: { imageSrc, thumbnailSrc }, message: "Image upload succeed" });
};
