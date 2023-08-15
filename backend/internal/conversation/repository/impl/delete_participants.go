package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *conversationRepository) DeleteParticipants(ConversationID uuid.UUID, tx *gorm.DB) error {

	result := tx.Where("conversation_id = ?", ConversationID).Delete(&dto.Participant{})
	if result.Error != nil {
		r.log.Errorln("[ERROR] Delete Participants Error:", result.Error)
		return customerrors.GetErrorType(result.Error)
	}

	return nil
}
