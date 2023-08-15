package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *messageRepository) DeleteMessages(ConversationID uuid.UUID, tx *gorm.DB) error {

	result := tx.Where("conversation_id = ?", ConversationID).Delete(&dto.Message{})
	if result.Error != nil {
		r.log.Errorln("[ERROR] Delete Messages Error:", result.Error)
		return customerrors.GetErrorType(result.Error)
	}

	return nil
}
