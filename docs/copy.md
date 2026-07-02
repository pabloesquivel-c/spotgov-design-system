# Copy guidelines

Agent-facing voice and wording rules for SpotGov product UI. Use with [`AGENTS.md`](../AGENTS.md), [`product-principles.md`](./product-principles.md), and [`component-patterns.md`](./component-patterns.md).

**Locale:** US English, conversational B2B. Use procurement terms (tender, contract, agency, bid, award, solicitation) when they match user vocabulary — without jargon walls.

---

## Voice

- Clear
- Calm
- Specific
- Concise
- Product-native
- No marketing fluff inside workflows

## Principles

- Say what happens, not how clever the product is
- Prefer verbs over nouns
- Name the object when possible
- Explain consequences before mechanics
- Avoid vague success language
- Avoid exclamation marks unless truly celebratory

## Buttons

- Use action verbs
- Be specific
- Avoid “Submit”, “Confirm”, “Proceed”
- Destructive actions name the action

**Good**

- Create project
- Invite teammate
- Delete workspace
- Save changes

**Bad**

- Continue
- OK
- Submit
- Yes

## Empty states

**Structure**

1. What is missing
2. Why it matters
3. What to do next

**Good**

> No projects yet  
> Create a project to organize your team's work.

**Bad**

> Nothing to see here!

## Errors

**Structure**

1. What failed
2. Why, if known
3. How to recover

**Good**

> Couldn't save changes  
> Check your connection and try again.

**Bad**

> Something went wrong

## Loading

- Avoid fake cleverness
- Use specific loading labels when delay is meaningful

**Good**

- Saving changes…
- Loading projects…

**Bad**

- Working magic…

## Confirmations

- Name the object
- State consequence
- Primary action matches consequence

**Example**

> Delete "Q3 roadmap"?  
> This can't be undone.

**Button:** Delete roadmap

## Avoid

Do not use in product UI copy:

- Seamless
- Powerful
- Intuitive
- Leverage
- Unlock
- Supercharge
- Effortless
- Robust
- Magic
- Next-gen
- Game-changing
- Utilize
