package impl

import (
	"backend/pkg/dto"
	"fmt"
)

func (s *notificationService) GetNotifications(req dto.GetNotificationsReq) ([]dto.NotificationResponse, error) {
	notifications, err := s.repo.GetNotifications(req)
	if err != nil {
		return nil, err
	}

	var notificationsResponse []dto.NotificationResponse
	for _, notification := range notifications {

		message := ""
		if notification.Activity == "ask" {
			message = "ask to you about"
		} else if notification.Activity == "like" && notification.Post.PostCategory == "question" {
			message = "like your question about"

		} else if notification.Activity == "like" && notification.Post.PostCategory != "question" {
			message = "like your post about"

		} else if notification.Activity == "comment" && notification.Post.PostCategory == "question" {
			// jika pemilik post == pemilik comment -> response...
			if notification.Post.UserID == notification.Comment.UserID {
				message = fmt.Sprintf("response \"%s\" in question about", notification.Comment.Comment)
				// jika user req != pemilik post ->
			} else if req.UserID != notification.Post.UserID {
				message = fmt.Sprintf("answer \"%s\" in question about", notification.Comment.Comment)
				// jika user req = pemilik post ->
			} else if req.UserID == notification.Post.UserID {
				message = fmt.Sprintf("answer \"%s\" in your question about", notification.Comment.Comment)
			}

		} else if notification.Activity == "comment" && notification.Post.PostCategory != "question" {
			message = fmt.Sprintf("comment \"%s\" in your post about", notification.Comment.Comment)

		}
		message = fmt.Sprintf("%s \"%s\"", message, notification.Post.Caption)

		notificationResponse := dto.NotificationResponse{
			ID:        notification.ID,
			Activity:  notification.Activity,
			IsRead:    notification.IsRead,
			CreatedAt: notification.CreatedAt,
			UpdatedAt: notification.UpdatedAt,
			FromUser: dto.PostUserResponse{
				ID:            notification.FromUser.ID,
				Name:          notification.FromUser.Name,
				ProfilePicURL: notification.FromUser.ProfilePicURL,
			},
			Post: dto.NotificationPostResponse{
				ID:             notification.Post.ID,
				Caption:        notification.Post.Caption,
				ContentFileURL: notification.Post.ContentFileURL,
				ContentType:    notification.Post.ContentType,
				PostCategory:   notification.Post.PostCategory,
			},
			Comment: dto.NotificationCommentResponse{
				ID:      notification.Comment.ID,
				Comment: notification.Comment.Comment,
			},
			Message: message,
		}

		notificationsResponse = append(notificationsResponse, notificationResponse)

	}
	return notificationsResponse, nil
}
