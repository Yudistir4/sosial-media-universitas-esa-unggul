package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *conversationRepository) GetConversationByID(ID uuid.UUID) (dto.Conversation, error) {

	var conversation dto.Conversation
	result := r.db.Preload("Participants.User").Preload("LastMessage").First(&conversation, ID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return dto.Conversation{}, customerrors.ErrConversationNotFound
		}
		return dto.Conversation{}, result.Error
	}
	return conversation, nil
}
