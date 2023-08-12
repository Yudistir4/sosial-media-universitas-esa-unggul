package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (s *conversationService) GetMessages(conversationID uuid.UUID) (*[]dto.MessageResponse, error) {

	messages, err := s.repoMessage.GetMessages(conversationID)
	if err != nil {
		return nil, err
	}

	var messagesResponse []dto.MessageResponse
	for _, message := range messages {
		messageResponse := dto.ConvertMessageToMessageResponse(message)
		messagesResponse = append(messagesResponse, messageResponse)
	}

	return &messagesResponse, nil
}
