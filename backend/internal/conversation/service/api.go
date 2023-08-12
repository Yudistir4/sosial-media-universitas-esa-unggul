package service

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

type ConversationService interface {
	CreateMessage(req dto.CreateMessageReq) (*dto.MessageResponse, error)
	CreateConversation(req dto.CreateConversationReq) (*dto.ConversationResponse, error)
	GetConversationByID(ID uuid.UUID) (*dto.ConversationResponse, error)
	GetConversations(req dto.GetConversationsReq) (*[]dto.ConversationResponse, error)
	GetMessages(conversationID uuid.UUID) (*[]dto.MessageResponse, error)
	MarkMessagesAsRead(req dto.MarkMessagesAsReadReq) error
	// DeleteConversation(req dto.DeleteConversationByIDReq) error
	// Vote(req dto.VoteReq) error
	// GetFacultysFilter() ([]dto.FacultyFilterResponse, error)
	// GetStudyProgramsFilter(FacultyID uuid.UUID) ([]dto.StudyProgramFilterResponse, error)
	// GetBatchesFilter(FacultyID uuid.UUID, StudyProgramID uuid.UUID) ([]int, error)

}
