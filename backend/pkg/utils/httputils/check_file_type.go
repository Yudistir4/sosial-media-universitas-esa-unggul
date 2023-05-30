package httputils

import (
	"mime/multipart"
	"path/filepath"
)

var (
	allowedProfilePicType = []string{".jpg", ".jpeg", ".png"}
	allowedPostType       = []string{".jpg", ".jpeg", ".png", ".mp4", ".avi", ".mov"}
)

func checkFileType(file *multipart.FileHeader, allowFileType []string) bool {
	ext := filepath.Ext(file.Filename)

	for _, t := range allowFileType {
		if t == ext {
			return true
		}
	}
	return false
}

func CheckProfilePicFileType(file *multipart.FileHeader) bool {
	return checkFileType(file, allowedProfilePicType)
}
func CheckPostFileType(file *multipart.FileHeader) bool {
	return checkFileType(file, allowedPostType)
}
