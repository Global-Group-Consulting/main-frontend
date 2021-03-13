import {Signer} from "~/@types/SignRequest/Signer";
import {EventTypes, WebhooksCall} from "~/@types/SignRequest/Webhooks";
import {SignRequestQuickCreate} from "~/@types/SignRequest/SignRequestQuickCreate";

export {Signer} from "./Signer";
export {SignRequestQuickCreate} from "./SignRequestQuickCreate";
export {Config} from "./Config"

export interface SignRequestLog {
  event: EventTypes
  timestamp: string
  user: string | null
}


