import AgentBritesType from "~/enums/AgentBritesType";

export class AgentBrite {
  id: string

  userId: string
  requestId: string

  // Total amount of the request
  requestTotal: number

  // Percentage caught from total amount
  requestPercent: number

  amount: number
  deposit: number
  motivation: string

  type: string

  created_at: string
  updated_at: string
}
