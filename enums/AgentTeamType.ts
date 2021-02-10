import {BasicEnum} from "~/classes/BasicEnum";

class AgentTeamType extends BasicEnum {
  public GROUP_PERCENTAGE = "group_percentage"
  public SUBJECT_PERCENTAGE = "subject_percentage"

  constructor() {
    super('AgentTeamType')

    this.data = {
      [this.GROUP_PERCENTAGE]: {
        id: "group_percentage",
      },
      [this.SUBJECT_PERCENTAGE]: {
        id: "subject_percentage",
      }
    }
  }
}

export default new AgentTeamType()
