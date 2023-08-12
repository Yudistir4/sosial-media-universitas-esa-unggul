package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *conversationRepository) CreateConversation(req dto.CreateConversationReq, tx *gorm.DB) (dto.Conversation, error) {
	conversation := dto.Conversation{
		ID: uuid.New(),
	}

	result := tx.Create(&conversation)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Create Conversation Error:", result.Error)
		return dto.Conversation{}, customerrors.GetErrorType(result.Error)
	}

	var participants []dto.Participant
	for _, id := range req.UserIDs {
		participant := dto.Participant{
			ID:             uuid.New(),
			ConversationID: conversation.ID,
			UserID:         id,
		}
		participants = append(participants, participant)
	}

	result = tx.Create(&participants)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Create Participants Error:", result.Error)
		return dto.Conversation{}, customerrors.GetErrorType(result.Error)
	}

	return conversation, nil
}
