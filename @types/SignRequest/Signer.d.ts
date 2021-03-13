import {SignerInputs} from "./SignerInputs";
import {SignerAttachment} from "./SignerAttachment";
import {InlineDocumentSignerIntegrationData} from "./InlineDocumentSignerIntegrationData";

export interface Signer {
  email: String
  display_name?: String
  first_name: String
  last_name: String
  email_viewed?: Boolean
  viewed?: Boolean
  signed?: Boolean
  downloaded?: Boolean
  signed_on?: Date
  needs_to_sign?: Boolean
  approve_only?: Boolean
  notify_only?: Boolean
  in_person?: Boolean
  order?: Number
  language?: String
  force_language?: Boolean
  emailed?: Boolean
  verify_phone_number?: String
  verify_bank_account?: String
  declined?: Boolean
  declined_on?: Date
  forwarded?: String
  forwarded_on?: Date
  forwarded_to_email?: String
  forwarded_reason?: String
  message?: String
  embed_url_user_id?: String
  inputs?: SignerInputs[],
  use_stamp_for_approve_only?: Boolean
  embed_url?: String
  attachments?: SignerAttachment[]
  redirect_url?: String
  redirect_url_declined?: String
  after_document?: String
  integrations?: InlineDocumentSignerIntegrationData[]
  password?: String
}
