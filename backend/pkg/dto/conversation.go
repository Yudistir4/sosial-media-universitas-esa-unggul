package dto

import (
	"time"

	"github.com/google/uuid"
)

type Conversation struct {
	ID            uuid.UUID      `gorm:"type:char(36);primary_key"`
	Participants  []*Participant `gorm:"foreignKey:ConversationID"`
	LastMessageID *uuid.UUID
	LastMessage   Message `gorm:"ForeignKey:LastMessageID"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

type CreateConversationReq struct {
	UserIDs []uuid.UUID `validate:"required" json:"user_ids"`
}
type ConversationResponse struct {
	ID           uuid.UUID             `json:"id"`
	Participants []*UserLittleResponse `json:"participants"`
	LastMessage  MessageResponse       `json:"last_message"`
	CreatedAt    time.Time             `json:"created_at"`
	UpdatedAt    time.Time             `json:"updated_at"`
}
type GetConversationsReq struct {
	LoggedInUserID uuid.UUID
	Page           int `query:"page"`
	Limit          int `query:"limit"`
}

func ConvertConversationToConversationResponse(conversation Conversation) ConversationResponse {
	var participants []*UserLittleResponse
	for _, item := range conversation.Participants {
		participant := UserLittleResponse{
			ID:            item.User.ID,
			Name:          item.User.Name,
			ProfilePicURL: item.User.ProfilePicURL,
		}
		participants = append(participants, &participant)
	}

	return ConversationResponse{
		ID:           conversation.ID,
		Participants: participants,
		LastMessage:  ConvertMessageToMessageResponse(conversation.LastMessage),
		CreatedAt:    conversation.CreatedAt,
		UpdatedAt:    conversation.UpdatedAt,
	}
}
