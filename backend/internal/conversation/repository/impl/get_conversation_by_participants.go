package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *conversationRepository) GetConversationByParticipants(UserIDs []uuid.UUID) (dto.Conversation, error) {

	var conversation dto.Conversation
	// err := r.db.Preload("Participants.User").Preload("LastMessage").
	// 	Joins("JOIN participants ON conversations.id = participants.conversation_id").
	// 	Where("participants.user_id IN ?", UserIDs).
	// 	First(&conversation).Error

	subquery := r.db.Table("participants").
		Select("conversation_id").
		Where("user_id IN (?)", UserIDs).
		Group("conversation_id").
		Having("COUNT(*) = ?", len(UserIDs))

	err := r.db.Preload("Participants.User").
		Preload("LastMessage").
		Joins("JOIN participants ON conversations.id = participants.conversation_id").
		Where("conversations.id IN (?)", subquery).
		First(&conversation).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return dto.Conversation{}, customerrors.ErrConversationNotFound
		}
		return dto.Conversation{}, err
	}
	return conversation, nil
}
