package httputils

import (
	"mime/multipart"
	"path/filepath"
)

var (
	allowedImageFileType = []string{".jpg", ".jpeg", ".png"}
	allowedPostFileType  = []string{".jpg", ".jpeg", ".png", ".mp4", ".avi", ".mov"}
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

func CheckImageFileType(file *multipart.FileHeader) bool {
	return checkFileType(file, allowedImageFileType)
}
func CheckPostFileType(file *multipart.FileHeader) bool {
	return checkFileType(file, allowedPostFileType)
}
func GetContentType(file *multipart.FileHeader) string {
	ext := filepath.Ext(file.Filename)

	for _, t := range allowedImageFileType {
		if t == ext {
			return "image"
		}
	}
	return "video"
}
