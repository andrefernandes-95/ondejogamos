# Object storage no Railway

## Fluxo

```text
App -> bucket privado -> presigner -> URL assinada -> imagem
```

## Incidente de 25-10-2026

```text
Sintoma
  imagens devolviam 403
      |
Causa 1
  secrets copiados manualmente ficaram desatualizados
      |
Causa 2
  endpoint path-style usado por um presigner virtual-host style
      |
Solução
  variáveis referenciam diretamente o bucket
  + endpoint virtual-host no presigner
      |
Resultado
  imagens reais respondem 200 image/jpeg
```

## Configuração

| Serviço | Variáveis S3 |
|---|---|
| `ondejogamos-app` | Referências diretas a `public files` |
| `s3-public-presigner` | Referências diretas, exceto o endpoint composto abaixo |

Endpoint do presigner:

```text
https://${{"public files".BUCKET}}.storage.railway.app
```

## Verificação

1. Confirmar que app e presigner estão em `SUCCESS`.
2. Abrir um URL persistente do presigner.
3. Seguir o redirect e confirmar `200` e `image/*`.

O health check do serviço, isoladamente, não valida a assinatura S3.

## Future-proofing

As referências evitam que uma rotação de credenciais deixe os serviços dessincronizados. Não garantem compatibilidade se o Railway alterar o formato dos endpoints ou se o template externo mudar o comportamento de assinatura; por isso o teste a um objeto real continua obrigatório.

O `.env` local não resolve referências Railway e pode ficar desatualizado. Um `SignatureDoesNotMatch` apenas em desenvolvimento deve começar pela comparação segura de `S3_SECRET_ACCESS_KEY` e `S3_REGION` com os valores atuais do bucket. Reiniciar o servidor local depois da sincronização.
