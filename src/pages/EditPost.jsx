import React,{useEffect,useState} from 'react'
import { Container, PostForm } from '../components'
import appwriteService from '../appwrite/config'
import {useNavigate, useParams } from 'react-router-dom'
import { getImageUrl } from "../appwrite/config";

function EditPost() {
    const [post, setPost] = useState(null)
    const {slug} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if(slug){
            appwriteService.getPost(slug).then((post) =>{
                if(post){
                    setPost(post)
                }
            })
        }
        else{
            console.warn("Slug is missing , redirecting home.")
            navigate('/')
        }
    },[slug,navigate])

    return post ? (
        <div className="py-8">
          <Container>
            {post.featuredImage && (
              <img
                src={getImageUrl(post.featuredImage)}
                alt="Post Preview"
                className="mb-4 rounded-xl max-w-md"
              />
            )}
            <PostForm post={post} />
          </Container>
        </div>
      ) : null;
      
}
export default EditPost