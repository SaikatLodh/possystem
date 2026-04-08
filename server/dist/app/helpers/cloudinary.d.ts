declare const uploadFile: (localfilePath: string) => Promise<{
    publicId: string;
    url: string;
} | null>;
declare const deleteImage: (publicId: string) => Promise<any>;
export { uploadFile, deleteImage };
//# sourceMappingURL=cloudinary.d.ts.map