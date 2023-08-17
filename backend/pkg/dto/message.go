package dto

import (
	"time"

	"github.com/google/uuid"
)

type Message struct {
	ID             uuid.UUID `gorm:"type:char(36);primary_key"`
	ConversationID uuid.UUID
	SenderID       uuid.UUID
	Sender         User `gorm:"ForeignKey:SenderID"`
	Text           string
	IsRead         bool `gorm:"default:false"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
}
type CreateMessageReq struct {
	ConversationID uuid.UUID `param:"conversation_id"`
	SenderID       uuid.UUID
	Text           string `json:"text"`
}
type MessageResponse struct {
	ID        uuid.UUID `json:"id"`
	SenderID  uuid.UUID `json:"sender_id"`
	ConversationID  uuid.UUID `json:"conversation_id"`
	Text      string    `json:"text"`
	IsRead    bool      `json:"is_read"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type GetMessagesReq struct {
	ConversationID uuid.UUID `param:"conversation_id"`
	Page           int       `query:"page"`
	Limit          int       `query:"limit"`
}
type MarkMessagesAsReadReq struct {
	ConversationID uuid.UUID `param:"conversation_id"`
	SenderID       uuid.UUID `json:"sender_id"`
}

func ConvertMessageToMessageResponse(message Message) MessageResponse {
	return MessageResponse{
		ID:        message.ID,
		SenderID:  message.SenderID,
		Text:      message.Text,
		CreatedAt: message.CreatedAt,
		UpdatedAt: message.UpdatedAt,
		IsRead:    message.IsRead,
		ConversationID: message.ConversationID,
	}

}
