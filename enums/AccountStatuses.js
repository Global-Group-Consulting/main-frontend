import { BasicEnum } from '../classes/BasicEnum'

/*

DRAFT - appena creato, ma non completato.
PENDING_SIGNATURE - creato, ma in attesa di firma del cliente. Siccome la firma viene richiesta tramite email, questa viene verificata nello stesso istante.
PENDING_CONFIRM - firma apposta e in attesa di conferma da parte di chi lo ha inserito.
CREATED - confermato dall'agente e in attesa del controllo serv_clienti
VALIDATED - confermato dal serv clienti
INCOMPLETE - dati incompleti.
MUST_REVALIDATE - in attessa di una seconda conferma dopo che era stato segnato compe non valido
APPROVED - Confermato anche dall'amministrazione
ACTIVE - Utente accede la prima volta ed inserisce il codice ricevuto per email.


*/
class AccountStatuses extends BasicEnum {
  constructor() {
    super('AccountStatuses')

    /** Created but not completed */
    this.DRAFT = "draft"

    /** Waiting for user signature */
    this.PENDING_SIGNATURE = "pending_signature"

    /** after user signature, waiting for agent confirmation */
    this.PENDING_CONFIRM = "pending_confirm"

    /** Account created and waiting for serv clienti validation */
    this.CREATED = "created"

    /** Account validate by serv clienti */
    this.VALIDATED = "validated"

    /** Missing data to the account */
    this.INCOMPLETE = "incomplete"

    /** Data completed and must revalidate */
    this.MUST_REVALIDATE = "must_revalidate"

    /** Account approved by the administration */
    this.APPROVED = "approved"

    /** Account activated by the user after the otp has been inserted */
    this.ACTIVE = "active"

    this.data = {
      [this.DRAFT]: {
        id: "draft",
      },
      [this.PENDING_SIGNATURE]: {
        id: "pending_signature"
      },
      [this.PENDING_CONFIRM]: {
        id: "pending_confirm"
      },
      [this.CREATED]: {
        id: "created"
      },
      [this.VALIDATED]: {
        id: "validated",
        color: "#FFEE58"
      },
      [this.INCOMPLETE]: {
        id: "incomplete",
        color: "#FFA726"
      },
      [this.MUST_REVALIDATE]: {
        id: "must_revalidate",
        color: "#CE93D8"
      },
      [this.APPROVED]: {
        id: "approved",
        color: "#cddc39"
      },
      [this.ACTIVE]: {
        id: "active",
        color: "#8bc34a"
      },
    }
  }
}

export default new AccountStatuses()
