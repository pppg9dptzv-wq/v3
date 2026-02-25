# send-submission-confirmation

Edge Function used by `script.js` after `SEND FOR VERIFICATION`.
The destination email is taken from the authenticated JWT (`auth.email` claim).

## Required secrets

Set these in Supabase project secrets:

- `RESEND_API_KEY`
- `FROM_EMAIL` (e.g. `Calisthenics Ranked <no-reply@yourdomain.com>`)
- `SITE_NAME` (optional)

## Deploy

```bash
supabase functions deploy send-submission-confirmation
```

This function expects an authenticated Supabase session (`Authorization: Bearer <access_token>`).

## Frontend config

In `supabase-config.js`:

```js
confirmationFunction: "send-submission-confirmation"
```
