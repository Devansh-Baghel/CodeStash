## Done

- [x] login page
- [x] register page
- [x] restructure project
- [x] write backend boilerplate
- [x] convert js boilerplate to ts
- [x] Loading components in /post/[postId]
- [x] Loading components in /post/[postId] Comments
- [x] Loading components in /
- [x] Loading components in /saved
- [x] Loading components in /upvotes
- [x] Loading components in /downvotes
- [x] redirect user to / when loggedin
- [x] /profile ui for not-logged-in user
- [x] save post feature for logged-in user
- [x] find a good favicon
- [x] change upvote downvote icons when clicked, also will have to save the upvotes and downvotes in user's model
- [x] add useTitle hook to every page
- [x] add download file option in post/[postID]
- [x] delete post toast
- [x] replace all h-5 w-5, h-4 w-4 with size-5, size-4 etc
- [x] search posts controller
- [x] search posts ui
- [x] create post from github link
- [x] create post from github raw link
- [x] create post from github gist link
- [x] create post from github gist raw link
- [x] create post from local file
- [x] filetype validations in create post from local file
- [x] add toast to tell user to set the download path before they try to open in vscode
- [x] add a limit on the number of characters that a user can enter into a post in /create-post
- [x] add a limit on the number of characters that a user can enter into a post in /update-post
- [x] add upload from github and upload local file features in /update-post
- [x] redirect user to /post/postid after updating a post
- [x] ai controllers
- [x] ai routes
- [x] ai works in backend
- [x] ai works in frontend
- [x] explain this snippet ai feature
- [x] show parsed markdown in the ai answer on frontend
- [x] tell gemini to give small and concise answers
- [x] fix: theme inside create-post and update-post code editors has changed to light mode because of markdown parsing being done by the same library
- [x] must be logged in user to use the ai features
- [x] remove unneccacary packages from frontend
- [x] better code display component in /post/postId from @uiwjs
- [x] show/hide option for profile card
- [x] add avatar dropdown menu from nextui
- [x] auto animate when hiding/showing profile card
- [x] fix: toasts animating weirdly because of auto animate
- [x] paginate in backend
- [x] paginate in frontend
- [x] paginate posts-by-lang endpoint
- [x] add explain this button in in AiAnswerCard when user hasn't gotten ai answer yet.
- [x] add mutation button component
- [x] better client side navigation without router.push()
- [x] use Links instead of router.push, because router.push does not prefetch any page
- [x] fix nextui ui Links doing a full page reload
- [x] add custom info toasts
- [x] change shadcn alert to nextui modal, animations aren't working in shadcn in DeletePostButton and CommentItem
- [x] remove demo user download path

## Not Done

- [ ] infinite scrolling posts/snippets in homepage
- [ ] view raw option in each post
- [ ] add formatting for number of comments, posts, upvotes, downvotes, etc like 1k, 2k, 3k, 1M, 2M, 3M etc
- [ ] create list feature for users to create a list of snippets etc.
- [ ] add loading user data loader in generic component to fetch the current user and block all rendering until then
- [ ] verify user before deleting community
- [ ] add "design help: nikhil" in final project readme
- [ ] add better errors in all page
- [ ] add "remove from upvotes" in /upvotes similar to "remove from saved" in /saved
- [ ] add "remove from downvotes" in /downvotes similar to "remove from saved" in /saved
- [ ] faq page maybe?
- [ ] add more allowed languages
- [ ] organise all components into folders
- [ ] only make get current user if the localstorage has userData or loggedIn
- [ ] allow user to import all snippets from github gist
- [ ] upload snippet as github gist
- [ ] paginate / that currently sends all the posts
- [ ] search button for not logged in user in sidebar (sidebar for not logged in user is empty)
- [ ] draft posts feature
- [ ] forgot password feature
- [ ] remove all ts ignore and fix all userTypes errors with !
- [ ] add error toast if github link is a private repo, and returns 404
- [ ] add react window to unload all components that aren't visible
- [ ] test open in vs code feature in windows
- [ ] test open in vs code feature without vs code install
- [ ] add id in all toasts so that they don't repeat on multiple clicks
- [ ] add react-query proper way, so queries don't refetch every time
- [ ] create a preview/banner image for codestash to add in github
- [ ] save ai answer in post model for future requests, if post model doesn't have ai answer then generate the ai answer (this is to save tokens + reduce ai requests)
- [ ] move copy to code and save post button at the top of the code content
- [ ] check text encoding 004 model if users hit 15rpm or token limit.
- [ ] remove unneccacary packages from backend
- [ ] Suspense or loading.tsx components for instant feedback when user clicks to go on a route
- [ ] better font for the title "CodeStash"
- [ ] add made with love by devansh baghel at the end of every section
- [ ] add page heading when components loading screens are present
- [ ] paginate posts-by-username endpoint
- [ ] add code embed feature
- [ ] add code share feature, share code on various platforms
- [ ] add feature to convert code snippet into a github gist post.
- [ ] in search page add tabs for "All matches", "Title", "Code", "Description"
- [ ] responsive
  1. [x] /
  2. [x] /profile
  3. [x] /saved
  4. [x] /upvoted
  5. [x] /downvoted
  6. [x] /u/username
  7. [x] /c/community
  8. [x] /languages
  9. [x] /settings
  10. [x] /login
  11. [x] /register
  12. [x] /communities
  13. [ ] /create-post
  14. [x] /create-community
  15. [ ] /update-post
  16. [ ] /post/postid
- [ ] add option to create-post in hamburger menu
- [ ] add option to create-community in hamburger menu
- [ ] add option to popular-languages in hamburger menu
- [ ] add option to account-settings in hamburger menu
- [ ] search another user option
- [ ] message another user option
- [ ] follow user option
- [ ] Loading screen in /u/username
- [ ] add og/meta tags for SEO
- [ ] replace all mutations with mutation button component
- [ ] add CodeRabbit in github
- [ ] use nextui block links instead of the button as a link https://nextui.org/docs/components/link#block-link
- [ ] use router.prefetch to prefetch the links that can't be converted to next/link
- [ ] display language tags with skillicons.dev
- [ ] create a custom useEffect wrapper hook that prefetches a page
- [ ] update post doesn't work, react query caching issue / nextjs caching issue.
- [ ] invalidate your posts /profile when create post, delete post, update post
- [ ] tell user to not enter spaces in communities name, parse community name to be url friendly
- [ ] add auto crop option for avatars and cover images, https://www.npmjs.com/package/smartcrop
- [ ] reloading /c/community doesn't show admin options
