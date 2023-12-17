function generateSignature(params: any) {
  const crypto = require("crypto");

  //UNIX timestamp
  const timestamp = Math.floor(Date.now() / 1000);

  params.timestamp = timestamp;

  //Sort the parameters
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  //String to sign
  const stringToSign = `${sortedParams}${process.env.CLOUDINARY_API_SECRET}`;

  //Generate the signature using SHA-1 hash
  const signature = crypto
    .createHash("sha1")
    .update(stringToSign)
    .digest("hex");

  return {
    timestamp,
    signature,
  };
}
export default generateSignature;
