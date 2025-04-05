import React, { useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    console.log("Uploading File:", data.image?.[0]);
    if (!userData || !userData.$id) {
      console.error("User is not authenticated.");
      return;
    }

    const file = data.image?.[0]
      ? await appwriteService.uploadFile(data.image[0])
      : null;
    const fileId = file?.$id || null;
    console.log("Uploaded File ID:", fileId);
    console.log("Final Post Data:", {
        ...data,
        featuredImage: fileId,
        userId: userData.$id,
      });
    if (post) {
      if (fileId) appwriteService.deleteFile(post.featuredImage);
      const dbPost = await appwriteService.updatePost(post.$id, {
        ...data,
        featuredImage: fileId || post.featuredImage,
      });
      if (dbPost) navigate(`/post/${dbPost.$id}`);
    } else {
      const dbPost = await appwriteService.createPost({
        ...data,
        featuredImage: fileId,
        userId: userData.$id,
      });
      console.log("Created Post:", dbPost);
      if (dbPost) navigate(`/post/${dbPost.$id}`);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />

        {post && post.featuredImage ? (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
              onError={(e) =>
                (e.currentTarget.src =
                  "https://via.placeholder.com/300x200?text=No+Image")
              }
            />
          </div>
        ) : (
          <div className="w-full mb-4 h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600">
            No Preview Image
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />

        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
PostForm.propTypes = {
  post: PropTypes.shape({
    $id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    status: PropTypes.string,
    featuredImage: PropTypes.string,
  }),
};
