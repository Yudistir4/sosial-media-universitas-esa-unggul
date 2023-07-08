package dto

import (
	"mime/multipart"
	"time"

	"github.com/google/uuid"
)

type Polling struct {
	ID        uuid.UUID `gorm:"type:char(36);primary_key"`
	IsPublic  bool
	UseImage  bool
	CreatedAt time.Time
	UpdatedAt time.Time
	Title     string
	UserID    uuid.UUID
	User      User `gorm:"ForeignKey:UserID"`
	EndDate   time.Time
	Options   []Option `gorm:"foreignKey:PollingID"`
}

type CreatePollingReq struct {
	Title          string `form:"title" validate:"required"`
	IsPublic       bool   `form:"is_public"`
	UseImage       bool   `form:"use_image"`
	LoggedInUserID uuid.UUID
	EndDate        time.Time         `form:"end_date" validate:"required"`
	TotalOptions   int               `form:"total_options" validate:"required"`
	Options        []CreateOptionReq `validate:"required"`
	Voters         []uuid.UUID       `form:"voters[]"`
}
type GetPollingByIDReq struct {
	LoggedInUserID uuid.UUID
	PollingID      uuid.UUID `param:"id" validate:"required"`
}
type VoteReq struct {
	LoggedInUserID uuid.UUID
	PollingID      uuid.UUID `param:"polling-id" validate:"required"`
	OptionID       uuid.UUID `param:"option-id" validate:"required"`
}
type DeletePollingByIDReq struct {
	LoggedInUserID uuid.UUID
	PollingID      uuid.UUID `param:"id" validate:"required"`
}
type GetPollingsReq struct {
	LoggedInUserID uuid.UUID
	UserID         uuid.UUID `query:"user_id"`
	Page           int       `query:"page"`
	Limit          int       `query:"limit"`
}
type GetStudyProgramsFilterReq struct {
	FacultyID uuid.UUID `query:"faculty_id" validate:"required"`
}
type GetBatchesFilterReq struct {
	FacultyID      uuid.UUID `query:"faculty_id" validate:"required"`
	StudyProgramID uuid.UUID `query:"study_program_id" validate:"required"`
}

type PollingResponse struct {
	ID         uuid.UUID          `json:"id"`
	IsPublic   bool               `json:"is_public"`
	UseImage   bool               `json:"use_image"`
	IsVoter    bool               `json:"is_voter"`
	CreatedAt  time.Time          `json:"created_at"`
	UpdatedAt  time.Time          `json:"updated_at"`
	Title      string             `json:"title"`
	User       UserLittleResponse `json:"user"`
	EndDate    time.Time          `json:"end_date"`
	Options    []OptionResponse   `json:"options"`
	UserChoice *VoterResponse     `json:"user_choice"`
}

type Option struct {
	ID            uuid.UUID `gorm:"type:char(36);primary_key"`
	PollingID     uuid.UUID `gorm:"ForeignKey:PollingID"`
	Text          string
	ImageURL      string
	ImagePublicID string
	Position      int
}
type OptionResponse struct {
	ID          uuid.UUID `json:"id"`
	Text        string    `json:"text"`
	ImageURL    string    `json:"image_url"`
	Position    int       `json:"position"`
	TotalVoters int64     `json:"total_voters"`
}

type CreateOptionReq struct {
	PollingID uuid.UUID
	Text      string `form:"text"`
	Image     *multipart.FileHeader
	ImageSrc  string
}

type Voter struct {
	ID        uuid.UUID `gorm:"type:char(36);primary_key"`
	PollingID uuid.UUID `gorm:"ForeignKey:PollingID"`
	UserID    uuid.UUID
	User      User       `gorm:"ForeignKey:UserID"`
	OptionID  *uuid.UUID `gorm:"ForeignKey:OptionID"`

	VoteAt    *time.Time
	CreatedAt time.Time
	UpdatedAt time.Time
}
type VoterResponse struct {
	ID       uuid.UUID  `json:"id"`
	OptionID *uuid.UUID `json:"option_id"`

	VoteAt *time.Time `json:"vote_at"`
}

type FacultyFilterResponse struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}
type StudyProgramFilterResponse struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}

func ConvertPollingToPollingResponse(polling *Polling) *PollingResponse {
	var options []OptionResponse
	for _, v := range polling.Options {
		option := OptionResponse{
			ID:       v.ID,
			Text:     v.Text,
			ImageURL: v.ImageURL,
			Position: v.Position,
		}
		options = append(options, option)
	}
	return &PollingResponse{
		ID:        polling.ID,
		CreatedAt: polling.CreatedAt,
		UpdatedAt: polling.UpdatedAt,
		EndDate:   polling.EndDate,
		Title:     polling.Title,
		// Description: polling.Description,
		IsPublic: polling.IsPublic,
		UseImage: polling.UseImage,
		Options:  options,

		User: UserLittleResponse{
			ID:            polling.User.ID,
			Name:          polling.User.Name,
			ProfilePicURL: polling.User.ProfilePicURL,
		},
	}
}

func ConvertVoterToVoterResponse(voter *Voter) *VoterResponse {
	return &VoterResponse{
		ID:       voter.ID,
		OptionID: voter.OptionID,
		VoteAt:   voter.VoteAt,
	}
}
