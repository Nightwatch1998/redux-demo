import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { createSelector } from '@reduxjs/toolkit'
import { selectUserById } from '../users/usersSlice'
import { useGetPostsQuery } from '../api/apiSlice'
// import { selectPostsByUser } from '../posts/postsSlice'

export const UserPage = ({ match }) => {
  const { userId } = match.params
  const user = useSelector(state => selectUserById(state, userId))

  const selectPostsForUser = useMemo(() => {
    const emptyArray = []
    // 返回此页面的唯一 selector 实例，以便
     // 过滤后的结果被正确记忆
    return createSelector(
      res => res.data,
      (res, userId) => userId,
      (data, userId) => data?.filter(post => post.user === userId) ?? emptyArray
    )
  }, [])

  // 使用相同的帖子查询，但仅提取其部分数据
  const { postsForUser } = useGetPostsQuery(undefined, {
    selectFromResult: result => ({
      // 我们可以选择在此处包含结果中的其他元数据字段
      ...result,
      // 在 hook 结果对象中包含一个名为 “postsForUser” 的字段，
        // 这将是一个过滤的帖子列表
      postsForUser: selectPostsForUser(result, userId)
    })
  })

  const postTitles = postsForUser.map(post => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  )
}