package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"context"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"

	"github.com/google/uuid"
)

func (s *userService) DeleteUser(ID uuid.UUID) (err error) {
	var FilePublicIds []string
	user, err := s.repo.GetUserByID(ID)
	if err != nil {
		return err
	}
	if user.ProfilePicPublicID != "" {
		FilePublicIds = append(FilePublicIds, user.ProfilePicPublicID)
	}

	tx := s.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	// Find all conversation
	conversations, err := s.repoConversation.GetConversations(dto.GetConversationsReq{LoggedInUserID: ID})
	if err != nil {
		s.log.Errorln("[ERROR] when get all conversations: ", err.Error())
		tx.Rollback()
		return err
	}

	var conversationIDs []uuid.UUID

	for _, conversation := range conversations {
		conversationIDs = append(conversationIDs, conversation.ID)

		// delete last message
		err = s.repoConversation.UpdateLastMessage(uuid.Nil, conversation.ID, tx)
		if err != nil {
			s.log.Errorln("[ERROR] when delete messages: ", err.Error())
			tx.Rollback()
			return err
		}
		// delete all messages related to conversationID
		err = s.repoMessage.DeleteMessages(conversation.ID, tx)
		if err != nil {
			s.log.Errorln("[ERROR] when delete messages: ", err.Error())
			tx.Rollback()
			return err
		}
		// delete all participants related to conversationID
		err = s.repoConversation.DeleteParticipants(conversation.ID, tx)
		if err != nil {
			s.log.Errorln("[ERROR] when delete participants: ", err.Error())
			tx.Rollback()
			return err
		}
	}
	// delete all conversation

	if len(conversationIDs) > 0 {
		err = s.repoConversation.DeleteConversations(conversationIDs, tx)
		if err != nil {
			s.log.Errorln("[ERROR] when delete conversations: ", err.Error())
			tx.Rollback()
			return err
		}
	}
	// Delete all likes,comment and saves
	err = s.repoNotification.DeleteNotificationsRelatedToUser(ID, tx)
	if err != nil {
		s.log.Errorln("[ERROR] when delete all notifications: ", err.Error())
		tx.Rollback()
		return err
	}
	err = s.repoLike.DeleteLikesRelatedToUser(ID, tx)
	if err != nil {
		s.log.Errorln("[ERROR] when delete all likes: ", err.Error())
		tx.Rollback()
		return err
	}
	err = s.repoComment.DeleteCommentsRelatedToUser(ID, tx)
	if err != nil {
		s.log.Errorln("[ERROR] when delete all comments: ", err.Error())
		tx.Rollback()
		return err
	}
	err = s.repoSave.DeleteSavesRelatedToUser(ID, tx)
	if err != nil {
		s.log.Errorln("[ERROR] when delete all saves: ", err.Error())
		tx.Rollback()
		return err
	}

	// delete all related voters
	err = s.repoVoter.DeleteVotersRelatedToUser(ID, tx)
	if err != nil {
		s.log.Errorln("[ERROR] when delete voters related to user: ", err.Error())
		tx.Rollback()
		return err
	}

	// get all post
	posts, err := s.repoPost.GetPostsRelatedToUser(ID)
	if err != nil {
		s.log.Errorln("[ERROR] when get all posts: ", err.Error())
		tx.Rollback()
		return err
	}
	s.log.Infoln("[INFO] total post: ", len(posts))

	for _, post := range posts {
		// store public id
		if post.ContentFilePublicID != "" {
			FilePublicIds = append(FilePublicIds, post.ContentFilePublicID)
		}
		// Delete all notif related to post
		s.log.Infoln("[INFO] start delete notif related to post: ", post.ID)
		err = s.repoNotification.DeleteNotifications(post.ID, tx)
		if err != nil {
			s.log.Errorln("[ERROR] when delete all notification related to post: ", err.Error())
			tx.Rollback()
			return err
		}
		//  Delete all likes related to post
		s.log.Infoln("[INFO] start delete likes related to post: ", post.ID)
		err = s.repoLike.DeleteLikes(post.ID, tx)
		if err != nil {
			s.log.Errorln("[ERROR] when delete all like related to post: ", err.Error())
			tx.Rollback()
			return err
		}
		//  Delete all saves related to post
		s.log.Infoln("[INFO] start delete saves related to post: ", post.ID)
		err = s.repoSave.DeleteSaves(post.ID, tx)
		if err != nil {
			s.log.Errorln("[ERROR] when delete all save related to post: ", err.Error())
			tx.Rollback()
			return err
		}
		//  Delete all comments related to post
		s.log.Infoln("[INFO] start delete comments related to post: ", post.ID)
		err = s.repoComment.DeleteComments(post.ID, tx)
		if err != nil {
			s.log.Errorln("[ERROR] when delete all comment related to post: ", err.Error())
			tx.Rollback()
			return err
		}
		//  END Looping

	}

	//  Delete all post
	err = s.repoPost.DeletePostsRelatedToUser(ID, tx)
	if err != nil {
		s.log.Errorln("[ERROR] when delete all posts: ", err.Error())
		tx.Rollback()
		return err
	}

	// get all polling
	pollings, err := s.repoPolling.GetPollings(dto.GetPollingsReq{UserID: ID, Page: 1, Limit: 99999999999})

	for _, polling := range pollings {
		//  if useImage => store public ID
		if polling.UseImage {
			for _, option := range polling.Options {
				FilePublicIds = append(FilePublicIds, option.ImagePublicID)
			}
		}
		//  Delete Notifications
		if err = s.repoNotification.DeleteNotificationsByPolling(polling.ID, tx); err != nil {
			s.log.Errorln("[ERROR] when delete all notification related to post: ", err.Error())
			tx.Rollback()
			return err
		}

		//  Delete Voters
		if err = s.repoVoter.DeleteVoters(polling.ID, tx); err != nil {
			s.log.Errorln("[ERROR] when delete all voter related to post: ", err.Error())
			tx.Rollback()
			return err
		}

		//  Delete Options
		if err = s.repoOption.DeleteOptions(polling.ID, tx); err != nil {
			s.log.Errorln("[ERROR] when delete all option related to post: ", err.Error())
			tx.Rollback()
			return err
		}
	}

	// Delete all polling
	if err = s.repoPolling.DeletePollingsRelatedToUser(ID, tx); err != nil {
		s.log.Errorln("[ERROR] when delete all polling: ", err.Error())
		tx.Rollback()
		return err

	}
	// Delete User
	err = s.repo.DeleteUser(&user, tx)
	// if error, rollback
	if err != nil {
		tx.Rollback()
		return err
	}
	if user.UserTypeName == "student" {
		// Delete Student
		err = s.repoStudent.DeleteStudentByID(ID, tx)
	} else if user.UserTypeName == "lecturer" {
		// Delete Lecturer
		err = s.repoLecturer.DeleteLecturerByID(ID, tx)
	} else if user.UserTypeName == "faculty" {

		// Check IF student  or lecturer still related to faculty, return err
		totalStudents, err := s.repo.GetTotalUsers(dto.GetUsersReq{UserType: "student", FacultyID: ID})
		if err != nil {
			return err
		}
		totalLecturers, err := s.repo.GetTotalUsers(dto.GetUsersReq{UserType: "lecturer", FacultyID: ID})
		if err != nil {
			return err
		}
		s.log.Infoln("[INFO] total students : ", totalStudents)
		s.log.Infoln("[INFO] total lecturers: ", totalLecturers)

		if totalStudents > 0 || totalLecturers > 0 {
			return customerrors.ErrStudentAndLecturerStillRelatedToThisFaculty
		}

		// Delete StudyPrograms
		if err = s.repoStudyProgram.DeleteStudyProgramsRelatedToUser(ID, tx); err != nil {
			s.log.Errorln("[ERROR] when delete all studyprograms: ", err.Error())
			tx.Rollback()
			return err
		}
		// Delete Faculty
		if err = s.repoFaculty.DeleteFacultyByID(ID, tx); err != nil {
			s.log.Errorln("[ERROR] when delete faculty: ", err.Error())
			tx.Rollback()
			return err
		}
	}

	// if error, rollback
	if err != nil {
		s.log.Errorln("[ERROR] when delete user :", err.Error())
		tx.Rollback()
		return err
	}

	s.log.Infoln("[INFO] total files: ", len(FilePublicIds))

	// Delete profile pic,image/video etc
	for _, publicID := range FilePublicIds {
		_, err := s.claudinary.Upload.Destroy(context.Background(), uploader.DestroyParams{PublicID: publicID})
		if err != nil {
			tx.Rollback()
			s.log.Errorln("[ERROR] while delete image file]")
			return err
		}
	}

	tx.Commit()

	return nil
}
