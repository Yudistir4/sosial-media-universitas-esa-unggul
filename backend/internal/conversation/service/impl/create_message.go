package impl

import (
	"backend/pkg/dto"
)

func (s *conversationService) CreateMessage(req dto.CreateMessageReq) (*dto.MessageResponse, error) {

	conversation, err := s.repo.GetConversationByID(req.ConversationID)
	if err != nil {
		return nil, err
	}

	tx := s.db.Begin()
	message, err := s.repoMessage.CreateMessage(req, tx)
	if err != nil {
		tx.Rollback()
		return nil, err
	}
	err = s.repo.UpdateLastMessage(message.ID, conversation.ID, tx)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	tx.Commit()

	messageResponse := dto.ConvertMessageToMessageResponse(message)
	return &messageResponse, nil
}
