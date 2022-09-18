import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { ArticleListItem, SubscriptionListItem } from "../../types/types";

type Props = {
	children: React.ReactNode
}

type UserContextValue = {
	subscriptions: SubscriptionListItem[] | []
	setSubscriptions: Dispatch<SetStateAction<UserContextValue["subscriptions"]>>,
	readingList: ArticleListItem[],
	setReadingList: Dispatch<SetStateAction<UserContextValue["readingList"]>>,
}

export const UserContext = createContext<UserContextValue>({
	subscriptions: [],
	setSubscriptions: () => [],
	readingList: [],
	setReadingList: () => [],
})

export function useUserContext() {
	const value = useContext(UserContext)
	if (value == null) {
		throw new Error("No UserContext value")
	} else {
		return value
	}
}

export default function UserContextProvider({ children }: Props) {

	const [subscriptions, setSubscriptions] = useState<UserContextValue["subscriptions"]>([])
	const [readingList, setReadingList] = useState<UserContextValue["readingList"]>([])

	return <UserContext.Provider value={{ subscriptions, setSubscriptions, readingList, setReadingList }}>
		{children}
	</UserContext.Provider>

}