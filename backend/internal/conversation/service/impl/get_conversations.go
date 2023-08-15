package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (s *conversationService) GetConversations(req dto.GetConversationsReq) (*[]dto.ConversationResponse, error) {

	conversations, err := s.repo.GetConversations(req)
	if err != nil {
		return nil, err
	}

	var conversationsResponse []dto.ConversationResponse
	for _, conversation := range conversations {
		conversationResponse := dto.ConvertConversationToConversationResponse(conversation)

		var senderID uuid.UUID
		for _, participant := range conversation.Participants {
			if participant.UserID != req.LoggedInUserID {
				senderID = participant.UserID
			}
		}
		conversationResponse.TotalUnreadMessage, err = s.repoMessage.GetTotalUnreadMessage(conversation.ID, senderID)
		if err != nil {
			return nil, err
		}

		conversationsResponse = append(conversationsResponse, conversationResponse)
	}

	return &conversationsResponse, nil
}
