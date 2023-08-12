package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
)

func (r *messageRepository) GetMessages(ConversationID uuid.UUID) ([]dto.Message, error) {
	var messages []dto.Message
	result := r.db.Where("conversation_id = ?", ConversationID).Order("created_at ASC").Find(&messages)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Get Message Error:", result.Error)
		return []dto.Message{}, customerrors.GetErrorType(result.Error)
	}

	return messages, nil
}
