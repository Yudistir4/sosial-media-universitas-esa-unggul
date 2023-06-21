package impl

import "github.com/google/uuid"

func (s *notificationService) GetTotalUnreadNotifications(UserID uuid.UUID) (int64, error) {

	return s.repo.GetTotalUnreadNotifications(UserID)
}
