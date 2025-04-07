import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    appwriteService
      .getPosts()
      .then((posts) => {
        console.log("Fetched Posts: ", posts);
        if (posts) {
          const activePosts = posts.documents.filter(
            (post) => post.status === "active"
          );
          setPosts(activePosts);
        }
      })
      .catch((err) => console.error(`Failed to fetch posts ${err}`));
  }, []);

  if (posts.length === 0) {
    return (
      <div className="w-full py-4 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500">
                Login to read posts
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }
  return (
    <div className="w-full py-4">
      <Container >
        <div className="flex flex-wrap">
          {posts
            .filter((post) => post.slug) // only posts with slug
            .map((post) => (
              <div key={post.$id} className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                <PostCard
                  $id={post.$id}
                  title={post.title}
                  featuredImage={post.featuredImage}
                  slug={post.slug}
                />
              </div>
            ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;
