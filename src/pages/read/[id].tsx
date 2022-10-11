import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { IoReturnUpBackSharp } from "react-icons/io5"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import ContentHeader from "../../components/Read/ContentHeader"
import SkeletonContent from "../../components/SkeletonComponents/SkeletonContent"
import SkeletonHeader from "../../components/SkeletonComponents/SkeletonHeader"
import { readArticle } from "../../lib/api"
import { useArticleQuery, useMarkAsReadMutation } from "../../lib/graphql-generated"

export default function ReadArticlePage() {

	const router = useRouter()
	const { id } = router.query
	const [content, setContent] = useState<string>("")
	const [, markRead] = useMarkAsReadMutation()

	const [article] = useArticleQuery({
		variables: {
			id: id
		}
	})

	const url = article.data?.article?.edges[0]?.node.url

	useEffect(() => {		
		async function getContent() {
				const data = url && await readArticle(url)
				if (data) {
					setContent(data.content)
				}
		}
    if (id) {
      getContent()
			markRead({
					id: id,
			})
    }
	}, [id, url, markRead])

	const domain = url && new URL(url)

	return (
		<div className="bg-slate-800">
			<article className="p-4 pb-12 mx-auto space-y-4 prose prose-invert line-clamp">
			<button onClick={() => router.back()}>
				<IoReturnUpBackSharp size={16} /> Back
			</button>
			{ domain ? <ContentHeader 
        id={article.data?.article?.edges[0]?.node.id}
        title={article.data?.article?.edges[0]?.node.title} 
        subscription={article.data?.article?.edges[0]?.node?.subscription} 
        description={article.data?.article?.edges[0]?.node?.description} 
        is_read={article.data?.article?.edges[0]?.node?.is_read || false}
        url={article.data?.article?.edges[0]?.node.url || ""} 
        hostname={domain?.hostname} 
        /> : <SkeletonHeader />}
			{content === ""	? <SkeletonContent/> : 
			<div className="prose-a:text-slate-300">
				<ReactMarkdown>
					{content}
				</ReactMarkdown>
			</div>
			} 
			<hr/>
			<button onClick={() => router.back()}>
				<IoReturnUpBackSharp size={16} /> Back
			</button>
			</article>

		</div>
	)
}
