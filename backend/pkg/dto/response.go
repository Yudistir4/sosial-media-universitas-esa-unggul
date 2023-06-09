package dto

type BaseResponse struct {
	Error   *ErrorBaseResponse `json:"error"`
	Message string             `json:"message"`
	Data    interface{}        `json:"data"`
}

type ErrorBaseResponse struct {
	Message string      `json:"message"`
	Detail  interface{} `json:"detail,omitempty"`
}

type ErrorResponse struct {
	HTTPErrorCode int
	Message       string
}
