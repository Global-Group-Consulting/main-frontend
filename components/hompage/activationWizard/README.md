Una volta che un utente viene aggiunto al database, gli si deve inizializzare le fasi di attivazione.

Una volt che l'utente accede, controllo auth.user.faseAttivazione e in base a quella capisco se
si deve attivare o meno.

Se si deve attivare, i dati del wizard li tengo tutti lato front, senza coninvolgere il server,
e li mando in un unica soluzione quando l'utente ha finito di inserire tutti i dati necessari.

Ci saranno solo 3 fasi a livello di db:
- iniziale (creata insieme all'anagrafica)
- utente ha aggiornato i dati
- admin ha confermato o meno i dati e l'attivazione.
    - se i dati non sono stati accettati, informa l'utente ma lo stato rimane uguale.

## Getters
    - currentPhase = ritorna la fase attuale dell'utente.
    
## API  
    - activationPhases - ADD 
 
