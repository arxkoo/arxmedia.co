# ARx Media website

Static website for ARx Media (www.arxmedia.co). Plain HTML, CSS and JavaScript: no WordPress, no PHP, no build step and no dependencies.

## What's inside

```
index.html               Home
isekai-zero.html         ISEKAI ZERO product page
solutions.html           Our solutions
about.html               About us
portfolio.html           Portfolio (with category filter)
contact.html             Contact
work-*.html              One page per portfolio project (35)
news-*.html              KRISTY.AI news articles (3)
css/site.css             Shared styles and animations
css/isekai-zero.css      Extra styles for the ISEKAI ZERO page
js/site.js               Hero parallax, image lightbox, portfolio filter, YouTube player
assets/                  Images, logos and videos
.nojekyll                Tells GitHub Pages to serve the files as they are
```

## Publish on GitHub Pages

1. Create a new repository on GitHub (for example `arxmedia-website`).
2. Upload everything in this folder to the root of the repository, including the hidden `.nojekyll` file.
   - On github.com: **Add file → Upload files**, drag in the folder contents, then **Commit changes**.
   - Or from a terminal:
     ```
     git init
     git add .
     git commit -m "ARx Media website"
     git branch -M main
     git remote add origin https://github.com/YOUR-ACCOUNT/arxmedia-website.git
     git push -u origin main
     ```
3. In the repository go to **Settings → Pages**, set **Source** to *Deploy from a branch*, pick `main` and `/ (root)`, then **Save**.
4. After a minute the site is live at `https://YOUR-ACCOUNT.github.io/arxmedia-website/`.

### Use your own domain (www.arxmedia.co)

1. In **Settings → Pages → Custom domain**, enter `www.arxmedia.co` and save. GitHub adds a `CNAME` file to the repository.
2. At your DNS provider, point `www` to GitHub with a CNAME record: `www → YOUR-ACCOUNT.github.io`.
3. Optional, for the bare domain `arxmedia.co`: add A records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`.
4. Back in **Settings → Pages**, tick **Enforce HTTPS** once it becomes available.

## Preview on your computer

Open `index.html` in a browser, or run a small local server from this folder so every link and video behaves like the live site:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Notes

- Fonts (Chakra Petch, Noto Sans SC, Cinzel, Poppins) load from Google Fonts.
- The ISEKAI ZERO video section loads thumbnails and the player from YouTube.
- The contact form has no server behind it. GitHub Pages can't run server code, so to receive messages connect the form to a form service (for example Formspree or Getform) by setting its `action` URL.
- Animations respect the visitor's "reduce motion" setting.
