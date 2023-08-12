package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
)

func (s *conversationService) CreateConversation(req dto.CreateConversationReq) (*dto.ConversationResponse, error) {

	conversation, err := s.repo.GetConversationByParticipants(req.UserIDs)
	if conversation.ID != uuid.Nil {
		return nil,customerrors.ErrDuplicatedConversation
	}
	if err != nil {
		if err != customerrors.ErrConversationNotFound {
			return nil, err
		}
	}

	tx := s.db.Begin()
	conversation, err = s.repo.CreateConversation(req, tx)

	if err != nil {
		tx.Rollback()
		return nil, err
	}

	// err = s.repoOption.CreateOptions(options, tx)
	// if err != nil {
	// 	tx.Rollback()
	// 	return nil, err
	// }

	tx.Commit()

	return s.GetConversationByID(conversation.ID)
}
