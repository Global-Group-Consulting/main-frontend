import {InlinePrefillTags} from "./InlinePrefillTags";
import {SignRequestQuickCreate} from "./SignRequestQuickCreate";
import {Signer} from "./Signer";

type EventTypes = "convert_error"
  | "converted"
  | "sending_error"
  | "sent"
  | "declined"
  | "cancelled"
  | "expired"
  | "signed"
  | "signer_signed"
  | "signer_email_bounced"
  | "signer_viewed_email"
  | "signer_viewed"
  | "signer_forwarded"
  | "signer_downloaded"
  | "signrequest_received"

export interface WebhooksCall {
  "uuid": string,
  "status": "ok" | "error",
  "event_type": EventTypes,
  "timestamp": string,
  "team": {
    "name": string,
    "subdomain": string,
    "url": string
  },
  "document": {
    "team": {
      "name": string,
      "subdomain": string,
      "url": string
    },
    "uuid": string,
    "file_as_pdf": string,
    "name": string,
    "file": string,
    "template": string,
    "prefill_tags": InlinePrefillTags<any>[],
    "integrations": [],
    "pdf": string,
    "status": "si",
    "signrequest": SignRequestQuickCreate
    "api_used": boolean,
    "signing_log": {
      "pdf": string,
      "security_hash": string
    },
    "security_hash": string,
    "attachments": [],
    "sandbox": boolean,
    "processing": boolean
  },
  "signer": Signer,
  "token_name": string,
  "event_time": string,
  "event_hash": string
}
