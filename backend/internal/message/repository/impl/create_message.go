package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *messageRepository) CreateMessage(req dto.CreateMessageReq, tx *gorm.DB) (dto.Message, error) {
	message := dto.Message{
		ID:             uuid.New(),
		SenderID:       req.SenderID,
		Text:           req.Text,
		ConversationID: req.ConversationID,
	}

	result := tx.Create(&message)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Create Message Error:", result.Error)
		return dto.Message{}, customerrors.GetErrorType(result.Error)
	}

	return message, nil
}
