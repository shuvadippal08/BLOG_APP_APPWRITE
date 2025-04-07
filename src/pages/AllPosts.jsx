import React, { useState, useEffect } from "react";
import appwriteService from "../appwrite/config";
import authService from "../appwrite/auth";
import { Container, PostCard } from "../components";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    authService.getCurrentUser()
      .then((user) => {
        if (user) {
          setUserId(user.$id);
          appwriteService.getPosts().then((posts) => {
            if (posts) {
              const userPosts = posts.documents.filter(
                (post) => post.userId === user.$id)
              
              setPosts(userPosts);
            }
          });
        }
      })
      .catch((err) => {
        console.log("User not logged in", err);
      });
  }, []);

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              <PostCard
                $id={post.$id}
                title={post.title}
                featuredImage={post.featuredImage}
                slug = {post.slug}
              />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;
