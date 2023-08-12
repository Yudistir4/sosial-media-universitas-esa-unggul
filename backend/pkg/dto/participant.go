package dto

import (
	"github.com/google/uuid"
)

type Participant struct {
	ID             uuid.UUID `gorm:"type:char(36);primary_key"`
	ConversationID uuid.UUID
	Conversation   Conversation `gorm:"ForeignKey:ConversationID"`
	UserID         uuid.UUID
	User           User `gorm:"ForeignKey:UserID"`
}
