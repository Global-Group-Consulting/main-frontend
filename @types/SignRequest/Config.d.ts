import {Signer} from "./Signer"
import {InlinePrefillTags} from "./InlinePrefillTags"
import {SignRequestQuickCreate} from "./SignRequestQuickCreate";

export type MainContractFields = "name" | "contractNumber"
export type IncomingMainContractFields = {
  [key in MainContractFields]: any
}

export interface TemplateConfig<AvailableField> {
  uuid: string
  fields: InlinePrefillTags<AvailableField>[]
}

export interface Config {
  apiKey: string
  publicUrl: string
  signRequestData: SignRequestQuickCreate,
  signers: {
    me: Signer
  },
  templates: {
    mainContract: TemplateConfig<MainContractFields>
  }
}
