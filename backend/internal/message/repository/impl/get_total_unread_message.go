package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
)

func (r *messageRepository) GetTotalUnreadMessage(ConversationID uuid.UUID, SenderID uuid.UUID) (int64, error) {
	var count int64
	result := r.db.Model(&dto.Message{}).Where("conversation_id = ? AND sender_id = ? AND is_read = false", ConversationID, SenderID).Count(&count)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Get Total unread Message Error:", result.Error)
		return 0, customerrors.GetErrorType(result.Error)
	}

	return count, nil
}
