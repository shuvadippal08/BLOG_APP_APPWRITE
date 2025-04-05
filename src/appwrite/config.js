import conf from '../conf/conf';
import {Client, ID, Databases, Storage, Query, Permission , Role } from 'appwrite';
import store from '../store/store';

export class Service{
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }
    async createPost({title, slug, content,
        featuredImage, status, userId }){
            try {
                console.log("Received Data in createPost:", {
                    title,
                    slug,
                    content,
                    featuredImage,
                    status,
                    userId,
                  });
              
                  if (!userId) {
                    console.error("Error: Missing userId in CreatePost");
                    return;
                  }
              
                  let fileId = null;
              
                  // Check if there's an image to upload
                  if (featuredImage instanceof File) {
                    const uploadedFile = await this.uploadFile(featuredImage);
                    fileId = uploadedFile?.$id;
              
                    if (!fileId) {
                      console.error("Error: File upload failed.");
                      return;
                    }
                  }else if (typeof featuredImage === "string"){
                    fileId = featuredImage;
                  }
                
                return await this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    ID.unique(),
                    {
                        title,
                        slug,
                        content,
                        featuredImage,
                        status,
                        userId,
                    },
                    
                )
            } catch (error) {
                console.log("Appwrite service :: createPost :: error ",error);
            }
    }

    async updatePost(slug, {title, content,
        featuredImage, status }){
            try {
                return await this.databases.updateDocument(conf.appwriteDatabaseId,conf.appwriteCollectionId,slug,
                    {
                        title,
                        content,
                        featuredImage,
                        status,
                    }
                )
            } catch (error) {
                console.log("Appwrite service :: updatePost :: error ",error)
            }
    }
    async deletePost(slug){
        try {
            await this.databases.deleteDocument(conf.appwriteDatabaseId,
                conf.appwriteCollectionId,slug
            )
            return true;
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error ",error);
            return false;
        }
    }

    async getPost(slug){
        try {
            const response =  await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [Query.equal("slug", slug)]
            );
            if (response.documents.length === 0) {
                console.warn(`No post found with slug: ${slug}`);
                return null;
              }
            return response.documents[0] ;// ||null
        } catch (error) {
            console.log("Appwrite service :: getPost :: error ",error);
            return null;//change from false
        }
    }

    async getPosts(queries = [Query.equal("status","active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
            )
        } catch (error) {
            console.log("Appwrite services :: getPosts :: error ",error);
            return null; //Change from false
        }
    }

    // file upload services

    async uploadFile (file){
        try {
            const state = store.getState();
            const userId = state.auth.userData?.$id;

            if(!userId){
                throw new Error("User ID not found in Redux Store");
            }
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
                [
                    Permission.read(Role.any()),
                    Permission.write(Role.user(userId))
                ]
            )
             
        } catch (error) {
            console.log("Appwrite services :: uploadFile :: error ",error);
            return false;
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error ",error);
            return false;
        }
    }

    // getFilePreview(fileId){
    //     return this.bucket.getFilePreview(
    //         conf.appwriteBucketId,
    //         fileId,
    //     )
    // }
    getFilePreview(fileId) {
        if (!fileId || typeof fileId !== "string") {
            console.warn("getFilePreview: Invalid fileId", fileId);
            return "https://via.placeholder.com/300x200?text=No+Image"; 
        }
    
        try {
            const previewUrl = this.bucket.getFilePreview(
                conf.appwriteBucketId,
                fileId
            );
    
            const urlStr = typeof previewUrl === 'string' ? previewUrl : previewUrl?.href;
    
            if (!urlStr || !urlStr.startsWith("http")) {
                throw new Error("Invalid preview URL returned by Appwrite");
            }
    
            const url = new URL(urlStr);
            const params = new URLSearchParams(url.search);
    
            const project = params.get("project");
            if (project) {
                params.delete("project");
                url.search = params.toString();
                url.searchParams.set("project", project);
            }
    
            return url.toString();
        } catch (error) {
            console.error("getFilePreview failed:", error);
            return null;
        }
    }
    getFileView(fileId) {
        try {
            if (!fileId || typeof fileId !== "string") {
                console.warn("getFileView: Invalid fileId", fileId);
                return null;
            }
    
            const view = this.bucket.getFileView(conf.appwriteBucketId, fileId);
            return view?.href || null;
        } catch (error) {
            console.error("getFileView failed:", error);
            return null;
        }
    }
    
    
    // getFilePreview(fileId) {
    //     if (!fileId || typeof fileId !== "string") {
    //         console.warn("getFilePreview: Invalid fileId", fileId);
    //         return null;
    //     }
    
    //     try {
    //         const preview = this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
    //         return preview?.href || null;
    //     } catch (error) {
    //         console.error("getFilePreview failed:", error);
    //         return null;
    //     }
    // }
    
    



    //assignments for download
}


const service = new Service();

export default service