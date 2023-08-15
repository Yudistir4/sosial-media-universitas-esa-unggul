package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ConversationRepository interface {
	GetConversationByParticipants(UserIDs []uuid.UUID) (dto.Conversation, error)
	GetConversationByID(ID uuid.UUID) (dto.Conversation, error)
	CreateConversation(req dto.CreateConversationReq, tx *gorm.DB) (dto.Conversation, error)
	GetConversations(req dto.GetConversationsReq) ([]dto.Conversation, error)
	UpdateConversation(conversation dto.Conversation, tx *gorm.DB) error
	UpdateLastMessage(LastMessageID uuid.UUID,ConversationID uuid.UUID, tx *gorm.DB) error
	// DeleteConversation(ID uuid.UUID, tx *gorm.DB) error
	// DeleteConversationsRelatedToUser(UserID uuid.UUID, tx *gorm.DB) error
	// GetFacultysFilter() ([]dto.FacultyFilterResponse, error)
	// GetStudyProgramsFilter(FacultyID uuid.UUID) ([]dto.StudyProgramFilterResponse, error)
	// GetBatchesFilter(FacultyID uuid.UUID, StudyProgramID uuid.UUID) ([]int, error)
}
