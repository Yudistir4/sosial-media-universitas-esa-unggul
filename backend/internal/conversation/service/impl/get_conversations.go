package impl

import (
	"backend/pkg/dto"
)

func (s *conversationService) GetConversations(req dto.GetConversationsReq) (*[]dto.ConversationResponse, error) {

	conversations, err := s.repo.GetConversations(req)
	if err != nil {
		return nil, err
	}

	var conversationsResponse []dto.ConversationResponse
	for _, conversation := range conversations {
		conversationResponse := dto.ConvertConversationToConversationResponse(conversation)
		conversationsResponse = append(conversationsResponse, conversationResponse)
	}

	return &conversationsResponse, nil
}
