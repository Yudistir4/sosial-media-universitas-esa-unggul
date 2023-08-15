package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"gorm.io/gorm"
)

func (r *conversationRepository) DeleteLastMessageInAllConversation(conversations []dto.Conversation, tx *gorm.DB) error {
	result := tx.Model(&conversations).Update("last_message_id", nil)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Delete last message in all conversation Error:", result.Error)
		return customerrors.GetErrorType(result.Error)
	}
	return nil
}
