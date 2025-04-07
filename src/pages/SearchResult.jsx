import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery().get("q");
  const [results, setResults] = useState([]);

  useEffect(() => {
    appwriteService.getPosts().then((posts) => {
      if (posts?.documents) {
        const filtered = posts.documents.filter((post) =>
          post.title.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      }
    });
  }, [query]);

  return (
    <div className='w-full py-8'>
      <Container>
        <h2 className="text-2xl font-bold mb-4">Search results for:{query}</h2>
        <div className="flex flex-wrap">
          {results.length > 0 ? (
            results.map((post) => (
              <div key={post.$id} className="p-2 w-1/4">
                <PostCard
                  $id={post.$id}
                  title={post.title}
                  featuredImage={post.featuredImage}
                  slug={post.slug}
                />
              </div>
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      </Container>
    </div>
  );
}

export default SearchResults;
