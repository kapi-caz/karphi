# Content

Every desktop file in `app/data/files.ts` points at one Markdown file in this folder (`content: '…'`).
The text is read when the site is built, so changes need a rebuild (or a running `pnpm dev`).

## `.txt` files → Notepad

Plain text, shown exactly as written. Links written as `[label](https://…)` become clickable.

## `.htm` files → Browser (pages with pictures)

Files with `app: 'browser'` are styled pages. They have a **frontmatter** block at the top
(header, footer, layout) and a normal **Markdown body**.

```md
---
layout: hero            # hero | split | gallery (default: hero)
header:                 # optional
  image: /content/projects/example/cover.jpg   # optional
  title: Example
  subtitle: One line under the title           # optional
footer:                 # optional
  links:
    - label: GitHub
      url: https://github.com/…
---

Normal Markdown text: paragraphs, **bold**, lists, [links](https://…), ## headings, tables.

![Alt text](/content/projects/example/screen.png "Optional caption")

:::carousel
![Alt 1](/content/projects/example/1.png "Caption 1")
![Alt 2](/content/projects/example/2.png "Caption 2")
:::
```

### Building blocks

| Block    | How                                                                                     |
| -------- | --------------------------------------------------------------------------------------- |
| Header   | `header:` in the frontmatter: `title`, optional `subtitle` and `image`                  |
| Text     | Normal Markdown                                                                         |
| Image    | `![alt](/path.png "caption")` on its own line; the caption (in quotes) is optional      |
| Carousel | Images between `:::carousel` and `:::`; arrows, dots, ←/→ keys and swiping on phones    |
| Footer   | `footer: links:` in the frontmatter, each with `label` and `url`                        |

Blocks appear in the order they're written in the body. `<!-- comments -->` are notes for you and never show up on the page; other raw HTML is ignored too.

### Layouts

- **hero**: the header image fills the width, and the title sits on it.
- **split**: a small header image next to the title, and pictures float beside the text in wide windows.
- **gallery**: single pictures flow into a grid, while text and carousels span the full width.

### Pictures

Put them in `public/content/…` and write the path without `public`, starting with `/`
(e.g. `/content/projects/musemachine/cover.svg`). The `/karphi` base path is added automatically.
The build fails if a picture is missing, so broken images never reach the live site.

### Turning a `.txt` into a page

In `app/data/files.ts`, rename the file to `.htm` and set `app: 'browser'` (optionally `icon: 'web'`,
`width`/`height`). Then add the frontmatter to its Markdown file.
