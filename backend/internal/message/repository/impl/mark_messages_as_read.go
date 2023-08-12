package impl

import (
	"backend/pkg/dto"
)

func (r *messageRepository) MarkMessagesAsRead(req dto.MarkMessagesAsReadReq) error {

	if err := r.db.Model(&dto.Message{}).Where("sender_id = ? AND conversation_id = ?", req.SenderID, req.ConversationID).Update("IsRead", true).Error; err != nil {
		r.log.Errorln("[ERROR] Mark Messages As Read Error:", err)
		return err
	}
	return nil
}
