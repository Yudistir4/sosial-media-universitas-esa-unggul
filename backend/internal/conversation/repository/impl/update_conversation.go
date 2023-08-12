package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"gorm.io/gorm"
)

func (r *conversationRepository) UpdateConversation(conversation dto.Conversation, tx *gorm.DB) error {

	result := tx.Save(&conversation)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Update Conversation Error:", result.Error)
		return customerrors.GetErrorType(result.Error)
	}
	return nil
}
