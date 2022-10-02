package parse

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Request struct {
	URLs   []string `json:"urls,omitempty"`
	URL    string   `json:"url,omitempty"`
	UserID string   `json:"userId,omitempty"`
}

type Response struct {
	Content       string                 `json:"content,omitempty"`
	Articles      []ArticlesResponse     `json:"articles,omitempty"`
	Subscriptions []SubscriptionResponse `json:"subscriptions,omitempty"`
	AffectedCount int                    `json:"affectedCount,omitempty"`
	Error         error                  `json:"error,omitempty"`
}

type SubscriptionResponse struct {
	UpdatedAt   time.Time `json:"updated_at"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	URL         string    `json:"url"`
	Icon        string    `json:"icon"`
	User        string    `json:"user"`
	Muted       bool      `json:"muted"`
}

type ArticlesResponse struct {
	Title        string `json:"title"`
	URL          string `json:"url"`
	PubDate      string `json:"pub_date"`
	Description  string `json:"description,omitempty"`
	Subscription string `json:"subscription"`
	Content      string `json:"content,omitempty"`
	UserID       string `json:"user_id"`
}

func HandleResponse(w http.ResponseWriter, res Response, cond bool) {
	j, err := json.Marshal(res)
	if err != nil {
		panic(err)
	}

	if cond {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusFound)
		fmt.Fprintf(w, "%s", j)
	} else {
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, "%s", j)
	}
}

func HandleRequest(r *http.Request) Request {
	var req Request
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		panic(err)
	}
	return req
}

func GetSubscription(xml XML, url string, icon string, user string) SubscriptionResponse {
	return SubscriptionResponse{
		UpdatedAt:   time.Now(),
		Title:       xml.Feed.Title,
		Description: xml.Feed.Description,
		URL:         url,
		Icon:        icon,
		User:        user,
		Muted:       false,
	}
}

func GetArticles(xml XML, url string, user string) []ArticlesResponse {

	var feedItems []EntriesXML
	var articles []ArticlesResponse

	if len(xml.Feed.Entries) > len(xml.Feed.Items) {
		feedItems = append(feedItems, xml.Feed.Entries...)
	} else {
		feedItems = append(feedItems, xml.Feed.Items...)
	}

	for _, item := range feedItems {
		articles = append(articles, ArticlesResponse{
			Title:        item.Title,
			URL:          item.URL,
			PubDate:      item.PubDate,
			Description:  item.Description,
			Subscription: xml.Feed.Title,
			Content:      item.Content,
			UserID:       user,
		})
	}

	return articles

}
