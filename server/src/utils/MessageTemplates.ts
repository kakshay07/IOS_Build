// ============*****************==============**************************
// ===== ***** DON'T FORMAT THIS FILE ***** ====== 
// ===== ***** DON'T CHANGE THE INDENTATION OF THIS FILE ***** ====== 
// ============*****************==============**************************

export default {
    email_templates : [
        {
            feature_name : 'send_email_on_invoice_raise',
            subject : 'THis is the subject',
            body : `Hi {{client_name}},
    
This email is to inform you that the task {{task_name}} is completed and the invoice for the same is same is attached below.

Thanks,
{{company_name}}`
        },
        {
            feature_name : 'send_email_on_task_complete',
            subject : 'THis is the subject',
            body : `Hi {{client_name}},
    
This email is to inform you that the task {{task_name}} is completed.

Thanks,
{{company_name}}`
        },
        {
            feature_name : 'send_demo_email',
            subject : 'This is a test email',
            body : `Hi {{client_name}},
    
This is a test email.

Thanks,
{{company_name}}`
        }
    ],
    sms_templates : [
        {
            feature_name : 'send_SMS_notification_on_invoice_raise',
            body : `Hi {{client_name}}, This is to inform you that the invoice has been raised for Rs {{amount}}. Thanks, {{company_name}}`
        },
    ]
}