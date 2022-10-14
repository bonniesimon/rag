import Head from "next/head";
import ArticleFeed from "../components/Articles/ArticleFeed"
import SubscriptionFeed from "../components/Subscriptions/SubscriptionFeed"
import FeedControls from "../components/Articles/FeedControls"

export default function HomePage() {
	return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Head>
                <title>Reading List - RAG</title>
            </Head>
            <div className="p-4">
                <FeedControls /> 
            </div>
            <div className="bg-slate-900 p-4 shadow-inner">
                <SubscriptionFeed />
            </div>
            <ArticleFeed />
        </div>
	)
}
