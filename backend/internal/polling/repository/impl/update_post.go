package impl

// import (
// 	"backend/pkg/dto"
// 	customerrors "backend/pkg/errors"
// )

// func (r *postRepository) UpdatePost(req dto.UpdatePostByIDReq) (dto.Post, error) {

// 	post, err := r.GetPostByID(req.PostID)
// 	if err != nil {
// 		return dto.Post{}, err
// 	}
// 	post.Caption = req.Caption

// 	result := r.db.Save(&post)
// 	if result.Error != nil {
// 		r.log.Errorln("[ERROR] Update Post Error:", result.Error)
// 		return dto.Post{}, customerrors.GetErrorType(result.Error)
// 	}
// 	return post, nil
// }
