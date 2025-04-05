import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// import appwriteService from "../appwrite/config";
import { getImageUrl } from "../appwrite/config";
function PostCard({ $id, title, featuredImage, slug }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl =
    featuredImage && !imgError
      ? getImageUrl(featuredImage)
      : "https://placehold.co/300x200?text=No+Image";
    if (!slug) {
        console.warn("PostCard: Missing slug for post:", $id);
        return null; // don't render incomplete card
      }
      
  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-4">
  <div className="w-full h-48 flex justify-center items-center mb-4 overflow-hidden rounded-xl bg-gray-200">
    <img
      src={imageUrl}
      alt={title}
      className="object-cover h-full w-full"
      onError={() => setImgError(true)}
    />
  </div>
  <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
</div>
    </Link>
  );
}

PostCard.propTypes = {
  $id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  featuredImage: PropTypes.string,
  slug: PropTypes.string.isRequired
};

export default PostCard;
