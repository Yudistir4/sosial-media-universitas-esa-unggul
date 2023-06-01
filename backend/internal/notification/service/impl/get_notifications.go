package impl

import "backend/pkg/dto"

func (s *notificationService) GetNotifications(req dto.GetNotificationsReq) ([]dto.NotificationResponse, error) {
	notifications, err := s.repo.GetNotifications(req)
	if err != nil {
		return nil, err
	}

	var notificationsResponse []dto.NotificationResponse
	for _, notification := range notifications {
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
			},
			Comment: dto.NotificationCommentResponse{
				ID:      notification.Comment.ID,
				Comment: notification.Comment.Comment,
			},
		}
		
		notificationsResponse = append(notificationsResponse, notificationResponse)

	}
	return notificationsResponse, nil
}
