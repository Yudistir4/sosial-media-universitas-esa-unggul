package emailutils

import (
	"bytes"
	"html/template"
)

var (
	sendPassword          = "assets/send-password.html"
	sendResetPasswordLink = "assets/send-reset-password-link.html"
	sendEmailVerificationCode  = "assets/send-email-verification-code.html"
	// EmailNotifNewInvoice       = "assets/email-notif-new-invoice.html"
	// EmailNotifResetPassSuccess = "assets/email-notif-reset-password-success.html"
	// EmailNotifCustomerHasPaid  = "assets/email-notif-customer-has-paid.html"
)

func parseTemplate(templateFileName string, data interface{}) (string, error) {
	t, err := template.ParseFiles(templateFileName)
	if err != nil {
		return "", err
	}
	buf := new(bytes.Buffer)
	if err = t.Execute(buf, data); err != nil {
		return "", err
	}
	body := buf.String()
	return body, nil
}
