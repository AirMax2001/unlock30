# Questa cartella contiene i file caricati (immagini e video)

I file caricati tramite l'admin vengono salvati qui e sincronizzati automaticamente su Git per non perderli mai.

## Come funziona:
1. Carichi una foto/video nell'admin
2. Il file viene salvato in questa cartella
3. Viene fatto un backup automatico su Git
4. Il file è disponibile in tutti i dispositivi

## Formati supportati:
- Immagini: jpg, jpeg, png, gif, webp
- Video: mp4, webm, mov, avi

I file sono serviti staticamente dal server all'endpoint `/uploads/filename`
