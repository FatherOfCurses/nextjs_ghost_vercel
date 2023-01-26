import Head from 'next/head'
import Image from 'next/image'

import styles from '../styles/Home.module.scss'
import React from "react";
import Link from "next/link";

const { BLOG_URL, CONTENT_API_KEY } = process.env

type Post = {
  title: string
  slug: string
}

async function getPosts() {
  const res = await fetch(`${BLOG_URL}/ghost/api/content/posts/?key=${CONTENT_API_KEY}&fields=title,slug,excerpt`)
      .then((res) => res.json())

  const posts = res.posts
  console.log(res)

  return posts
}

export const getStaticProps = async () => {
  const posts = await getPosts()
  return {
    props: {posts},
    revalidate: 300
  }
}

const Home:React.FC<{ posts: Post[] }> = (props) => {
  const { posts } = props;

  return (
    <div className={styles.container}>
      <h1>Welcome to my blog</h1>
      <ul>
        {posts.map((post, index) => {
          return <li key={post.slug}>
            <Link href="/post/[slug]" as={`/post/${post.slug}`}>
              {post.title}
            </Link>
          </li>
        })}
      </ul>
    </div>
      )
}

export default Home;
