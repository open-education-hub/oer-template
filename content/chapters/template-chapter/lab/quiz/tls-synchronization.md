# TLS Synchronisation

## Question Text

Is placing `var` from `support/race-condition/c/race_condition_tls.c` in the TLS a valid form of synchronisation?

## Question Answers

+ No, because 

## Feedback

Synchronisation means that both threads should access the same variable, whereas placing it in the TLS makes each of them access a copy of the variable.
