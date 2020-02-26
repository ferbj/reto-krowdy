
import fs from 'fs'
import path from 'path'
import aws from 'aws-sdk';
require('dotenv/config')

const s3 = new aws.S3({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: process.env.REGION,
    s3BucketEndpoint:false,
    endpoint:"https://s3.amazonaws.com"
});

function uploadS3() {
  
    const ruta = 'D:/mosaicvideo-grupo/files/mosaico/';
    const uploadPath = path.join(ruta);
   
    fs.readdir(uploadPath, (err, files) => {
        console.log('se esta subiendo', uploadPath)
        if(!files || files.length === 0) {
          console.log(`provided folder '${uploadPath}' is empty or does not exist.`);
          console.log('Make sure your project was compiled!');
          return;
        }
      
        // for each file in the directory
        for (const fileName of files) {
      
          // get the full path of the file
          const filePath = path.join(uploadPath, fileName);
          console.log(fileName)
          // ignore if directory
          if (fs.lstatSync(filePath).isDirectory()) {
            continue;
          }
      
          // read file contents
          fs.readFile(filePath, (error, fileContent) => {
            // if unable to read file contents, throw exception
            if (error) { throw error; }
            // upload file to S3
            
            s3.upload({
                Bucket: process.env.BUCKET_NAME,
                Key: fileName,
                Body: fileContent
              },(err,data) => {
              console.log(`Successfully uploaded '${fileName}'!`);
              console.log('location',data.Location);
              console.log('error',err)
            });
      
          });
        }
      });
}
export default uploadS3;
