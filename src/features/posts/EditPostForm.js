import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useGetPostQuery, useEditPostMutation } from '../api/apiSlice'

export const EditPostForm = ({ match }) => {
  const { postId } = match.params

  const { data: post } = useGetPostQuery(postId)
  // eslint-disable-next-line 
  const [ updatePost, { isLoading}] = useEditPostMutation()

  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)

  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)

  const history = useHistory()
  
  const onSavePostClicked = async () => {
    if (title && content) {
      await updatePost({ id: postId, title, content })
      history.push(`/posts/${postId}`)
    }
  }

  return (
    <section>
      <h2>编辑文章</h2>
      <form>
        <label htmlFor="postTitle">文章标题：</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">内容：</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
      </form>
      <button type="button" onClick={onSavePostClicked}>
        保存文章
      </button>
    </section>
  )
}