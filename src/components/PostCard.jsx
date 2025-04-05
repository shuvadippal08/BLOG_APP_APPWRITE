import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import appwriteService from "../appwrite/config";

function PostCard({ $id, title, featuredImage, slug }) {
  const [imgError, setImgError] = useState(false);

  const imageUrl =
    featuredImage && !imgError
      ? appwriteService.getFileView(featuredImage)
      : "https://placehold.co/300x200?text=No+Image";
    if (!slug) {
        console.warn("PostCard: Missing slug for post:", $id);
        return null; // don't render incomplete card
      }
      
  return (
    <Link to={`/post/${slug}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4">
        <div className="w-full justify-center mb-4">
          <img
            src={imageUrl}
            alt={title}
            className="rounded-xl"
            onError={() => setImgError(true)}
          />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
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
