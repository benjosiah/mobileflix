import { string } from '@ioc:Adonis/Core/Helpers'

const MailTemplateVariables = {
    app_url: process.env.APP_URL,
    company_name: string.capitalCase(process.env.APP_NAME!),
    contact_email: process.env.MAIL_FROM,
    support_email: process.env.MAIL_FROM,
    privacy_policy_url: process.env.APP_URL + "/privacy-policy",
    contact_url: process.env.APP_URL + "/contact",
    company_address: "Lagos, Nigeria",
}

export default MailTemplateVariables;