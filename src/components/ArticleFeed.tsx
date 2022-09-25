import {motion} from "framer-motion"
import { gql, useQuery } from "urql"
import {container, item} from "../constants/animation"
import { ArticlePreview } from "../types/types"
import Alert, { Level } from "./Alert"
import ArticleCard, {SkeletonArticleCard} from "./ArticleCard"
import {useAppContext} from "./provider/AppContextProvider"

type EdgeType = {
	node: ArticlePreview
}


export default function ArticleFeed() {
  
  const { articles } = useAppContext()

  const ArticlesQuery = gql`
    query ($ids: [UUID!]) {
      articlesCollection(filter: {id: {in: $ids}}, orderBy: {pub_date: DescNullsLast}) {
        edges {
          node {
            id
            title
            description
            url
            pub_date
            subscription
            is_read
          }
        }
      }
    }
  `

	const [{ data, fetching, error }] = useQuery({
		query: ArticlesQuery,
    variables: {
      ids: articles,
    }
	})

	if (error) return <Alert text="Error loading articles..." level={Level.warn} />

  return (
    <motion.ol variants={container} initial="hidden" animate="show">
      { fetching && <LoadingState/> }
      { data && data.articlesCollection.edges.map((edge: EdgeType) => {
        return <motion.li key={edge.node.title} variants={item}>
          <ArticleCard article={edge.node} />
        </motion.li> 
      })}
    </motion.ol>
  )

}

function LoadingState() {
  return <>
    <SkeletonArticleCard/>
    <SkeletonArticleCard/>
    <SkeletonArticleCard/>
    </>
}
