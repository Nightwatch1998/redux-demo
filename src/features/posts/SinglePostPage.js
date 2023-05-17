import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'
import { selectPostById } from './postsSlice'

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params

  const post = useSelector(state =>
    selectPostById(state,postId)
  )

  if (!post) {
    return (
      <section>
        <h2>页面未找到！</h2>
      </section>
    )
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <p className="post-content">{post.content}</p>
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
        <PostAuthor userId={post.user} />
        <ReactionButtons post={post} />
      </article>
    </section>
  )
}