package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *conversationRepository) UpdateLastMessage(LastMessageID uuid.UUID, ConversationID uuid.UUID, tx *gorm.DB) error {
	var result *gorm.DB
	if LastMessageID == uuid.Nil {
		result = tx.Model(&dto.Conversation{ID: ConversationID}).Update("last_message_id", nil)
	} else {
		result = tx.Model(&dto.Conversation{ID: ConversationID}).Update("last_message_id", LastMessageID)
	}
	if result.Error != nil {
		r.log.Errorln("[ERROR] Update Conversation Error:", result.Error)
		return customerrors.GetErrorType(result.Error)
	}
	return nil
}
