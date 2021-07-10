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
      },
      [this.MANUAL_ADD]: {
        id: this.MANUAL_ADD,
      },
      [this.MANUAL_REMOVE]: {
        id: this.MANUAL_REMOVE,
      }
    }
  }
}

export default new AgentBritesType()
