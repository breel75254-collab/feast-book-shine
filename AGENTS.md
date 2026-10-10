<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- App code reads/writes ads through the `listings` view, never `/ads` — browser ad blockers block URLs containing "ads".
- AI calls live in server-only `src/server/ai.server.ts` (Lovable AI Gateway, Responses API); ad review runs in `reviewAd` server fn, help chat streams from `/api/chat` — keeps keys server-side.
