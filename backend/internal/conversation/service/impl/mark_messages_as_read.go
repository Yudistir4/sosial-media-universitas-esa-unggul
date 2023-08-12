package impl

import (
	"backend/pkg/dto"
)

func (s *conversationService) MarkMessagesAsRead(req dto.MarkMessagesAsReadReq) error {
	return s.repoMessage.MarkMessagesAsRead(req)
}
