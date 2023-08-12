package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type MessageRepository interface {
	CreateMessage(req dto.CreateMessageReq, tx *gorm.DB) (dto.Message, error)
	GetMessages(ConversationID uuid.UUID) ([]dto.Message, error)
	MarkMessagesAsRead(req dto.MarkMessagesAsReadReq) error
}
