package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type MessageRepository interface {
	CreateMessage(req dto.CreateMessageReq, tx *gorm.DB) (dto.Message, error)
	GetMessages(ConversationID uuid.UUID) ([]dto.Message, error)
	GetTotalUnreadMessage(ConversationID uuid.UUID, SenderID uuid.UUID) (int64, error)
	MarkMessagesAsRead(req dto.MarkMessagesAsReadReq) error
	DeleteMessages(ConversationID uuid.UUID, tx *gorm.DB) error
}
