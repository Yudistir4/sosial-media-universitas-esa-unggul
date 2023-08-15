package impl

import (
	"backend/pkg/dto"
)

func (r *conversationRepository) GetConversations(req dto.GetConversationsReq) ([]dto.Conversation, error) {
	// offset := (req.Page - 1) * req.Limit
	var conversations []dto.Conversation
	query := r.db.Preload("Participants.User").Preload("LastMessage").
		Joins("JOIN participants ON conversations.id = participants.conversation_id")

	if req.IsLastMessageMustExist {
		query = query.Where("participants.user_id = ? AND last_message_id IS NOT NULL", req.LoggedInUserID).Order("updated_at DESC")
	} else {
		query = query.Where("participants.user_id = ? ", req.LoggedInUserID).Order("updated_at DESC")
	}
	err := query.Find(&conversations).Error
	// err := r.db.Preload("Participants.User").Preload("LastMessage").
	// 	Joins("JOIN participants ON conversations.id = participants.conversation_id").
	// 	Where("participants.user_id IN ?", UserIDs).
	// 	First(&conversation).Error
	if err != nil {
		return []dto.Conversation{}, err
	}
	return conversations, nil
}
