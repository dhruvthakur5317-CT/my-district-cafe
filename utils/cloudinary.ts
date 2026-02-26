import { v2 as cloudinary } from 'cloudinary';

// Configure cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
    fileBuffer: Buffer,
    folder: string = 'mydistrictcafe',
    resourceType: 'auto' | 'image' | 'video' | 'raw' = 'auto'
) => {
    return new Promise<{ secure_url: string; public_id: string; format: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder, resource_type: resourceType },
            (error, result) => {
                if (error || !result) {
                    reject(error || new Error('Upload to Cloudinary failed.'));
                } else {
                    resolve({
                        secure_url: result.secure_url,
                        public_id: result.public_id,
                        format: result.format,
                    });
                }
            }
        );

        uploadStream.end(fileBuffer);
    });
};

export default cloudinary;
