package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *conversationRepository) DeleteConversations(ConversationIDs []uuid.UUID, tx *gorm.DB) error {

	result := tx.Delete(&dto.Conversation{}, ConversationIDs)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Delete Conversation Error:", result.Error)
		return customerrors.GetErrorType(result.Error)
	}

	return nil
}
