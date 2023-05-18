import React, { useState } from 'react'
import { useSelector } from 'react-redux'

// import { Spinner } from '../../components/Spinner'
import { selectAllUsers } from '../users/usersSlice'
import { useAddNewPostMutation } from '../api/apiSlice'

export const AddPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')

  const [addNewPost, { isLoading }]= useAddNewPostMutation()
  // 使用adaptor 生成的users
  const users = useSelector(selectAllUsers)

  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)
  const onAuthorChanged = e => setUserId(e.target.value)

  const canSave = [title,content,userId].every(Boolean) && !isLoading
  // console.log(canSave,title,content,userId,isLoading)
  const onSavePostClicked = async () => {
    if(canSave){
      try{
        await addNewPost({title,content,user:userId}).unwrap()
        setTitle('')
        setContent('')
        setUserId('')
      }catch(err){
        console.error('Failed to save the post:',err)
      }
    }
  }


  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>添加新文章</h2>
      <form>
        <label htmlFor="postTitle">文章标题:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">内容：</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>保存文章</button>
      </form>
    </section>
  )
}