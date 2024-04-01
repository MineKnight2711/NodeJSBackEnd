const express = require('express')

const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin')

admin.initializeApp(
    {
        credential: admin.credential.cert("./private/trasua5anhem_key.json"),
        storageBucket: "trasua5anhem.appspot.com"
    }
);
const bucket=admin.storage().bucket();

// /**
//  * Uploads an image file to Google Cloud Storage and returns the public download URL.
//  *
//  * @param {Buffer} fileBuffer - The file buffer to upload.
//  * @param {string} savePath - The path to save the file in the bucket.
//  * @param {string} objectName - The name of the object (file) to be uploaded.
//  * @returns {Promise<string>} The public download URL of the uploaded file.
//  */
 async function uploadImage(fileBuffer, savePath, objectName) {
    try {
      // Generate a unique file name with a UUID and the original object name
      const fileName = `${uuidv4()}_${objectName}`;
  
      // Set the file path within the bucket
      const storagePath = `testnode/${fileName}`
  
      // Create a new file instance with metadata
      const file = bucket.file(storagePath);
      const blobStream = file.createWriteStream({
        metadata: {
          contentType: 'image/jpeg',
          metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
          },
          cacheControl: 'public, max-age=31536000',
        },
        gzip: true, // Enable compression
      });
  
      // Upload the file buffer to the file instance
      blobStream.end(fileBuffer);
  
      // Wait for the upload to complete
      await new Promise((resolve, reject) => {
        blobStream.on('error', (err) => {
          if (err.code !== 'STREAM_ENDED') {
            reject(err);
          }
        });
        blobStream.on('finish', resolve);
      });
  
      // Get the public download URL of the uploaded file
      const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
      console.log(downloadUrl)
      return downloadUrl;
    } catch (error) {
      throw error;
    }
  }
module.exports.uploadImage = uploadImage;