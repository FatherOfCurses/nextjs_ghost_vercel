import Link from 'next/link'
import {useRouter} from "next/router";
import styles from '../../styles/Home.module.scss'
import React, {useState} from "react";

const { BLOG_URL, CONTENT_API_KEY } = process.env

async function getPost(slug: string) {
    const res = await fetch(`${BLOG_URL}/ghost/api/content/posts/slug/${slug}/?key=${CONTENT_API_KEY}&fields=title,slug,html`)
        .then((res) => res.json())

    const posts = res.posts

    return posts[0]
}


// @ts-ignore
export const getStaticProps = async ({params}) => {
    const post = await getPost(params.slug)
    return {
        props: {post},
        revalidate: 300
    }
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: true
    }
}

type Post = {
    title: string
    html: string
    slug: string
}

type Page = {
    url: string
    identifier: string
}

const Post: React.FC <{post: Post, page: Page}> = props => {

    console.log(props)

    const { post, page } = props
    const [enableLoadComments, setEnableLoadComments] = useState<boolean>(true)

    const router = useRouter()
    if (router.isFallback) {
        return <h1>Loading...</h1>
    }

    function loadComments() {
        setEnableLoadComments(false)
        ;(window as any).disqus_config = function () {
            page.url = window.location.href;
            page.identifier = post.slug;
        };

        const script = document.createElement('script')
        script.src = 'https://principe-io.disqus.com/embed.js'
        script.setAttribute('data-timestamp', Date.now().toString())

        document.body.appendChild(script)
    }

    return (
        <div className={styles.container}>
            <Link href="/">
                Go back
            </Link>
            <h1>{post.title}</h1>
            <div dangerouslySetInnerHTML={{__html: post.html}}></div>

            {enableLoadComments && (
                <p className={styles.goback} onClick={loadComments}>Load Comments</p>
                )}
            <div id="disqus_thread"></div>
        </div>
    )
}

export default Post;
