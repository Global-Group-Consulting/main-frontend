import {BasicEnum} from "~/classes/BasicEnum";

class AgentBritesType extends BasicEnum {
  public FROM_WITHDRAWL = "from_withdrawl";
  public MANUAL_ADD = "manual_add";
  public MANUAL_REMOVE = "manual_remove";

  constructor() {
    super('AgentBritesType')

    this.data = {
      [this.FROM_WITHDRAWL]: {
        id: this.FROM_WITHDRAWL,
      }
    }
  }
}

export default new AgentBritesType()
