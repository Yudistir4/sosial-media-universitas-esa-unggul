package impl

import "github.com/google/uuid"

func (s *notificationService) MarkNotificationsAsRead(UserID uuid.UUID) error {
	return s.repo.MarkNotificationsAsRead(UserID)
}
