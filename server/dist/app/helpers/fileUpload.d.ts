interface FileInput {
    filename: string;
    mimetype: string;
    encoding: string;
    data: string;
}
export declare const saveAndUploadFile: (file: FileInput, folderName?: string) => Promise<{
    publicId: string;
    url: string;
} | null>;
export {};
//# sourceMappingURL=fileUpload.d.ts.map