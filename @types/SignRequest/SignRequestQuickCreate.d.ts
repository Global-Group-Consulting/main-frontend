import {Signer} from "./Signer";
import {InlinePrefillTags} from "./InlinePrefillTags";

export interface SignRequestQuickCreate {
  from_email?: string
  from_email_name?: string
  is_being_prepared?: string
  prepare_url?: string
  redirect_url?: string
  redirect_url_declined?: string
  required_attachments?: string
  disable_attachments?: string
  disable_text_signatures?: string
  disable_text?: string
  disable_date?: string
  disable_emails?: string
  disable_upload_signatures?: string
  disable_blockchain_proof?: string
  text_message_verification_locked?: string
  subject?: string
  message?: string
  who?: "m" | "mo" | "o"
  send_reminders?: string
  signers?: Signer[]
  uuid?: string
  url?: string
  document?: string
  integration?: string
  integration_data?: string
  name?: string
  external_id?: string
  frontend_id?: string
  file?: string
  file_from_url?: string
  events_callback_url?: string
  file_from_content?: string
  file_from_content_name?: string
  template: string
  prefill_tags?: InlinePrefillTags<any>[]
  integrations?: string
  file_from_sf?: string
  auto_delete_days?: string
  auto_expire_days?: string
}
