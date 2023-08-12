package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (s *conversationService) GetConversationByID(ID uuid.UUID) (*dto.ConversationResponse, error) {

	conversation, err := s.repo.GetConversationByID(ID)
	if err != nil {
		return nil, err
	}
	conversationResponse := dto.ConvertConversationToConversationResponse(conversation)
	return &conversationResponse, nil
}
